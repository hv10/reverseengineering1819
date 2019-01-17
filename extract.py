from pathlib import Path
from PIL import Image
import os
import sys
import filetype
import math
import struct
import simpleaudio as sa

# 8byte palette header + 256 entry each 8 bytes
# 2bytes key
# RRGGBB
# but wierdly 2052??
PALETTE_LENGTH = 2052


class WarExtractor():
    def __init__(self, f_path):
        self.f_path = Path(f_path)
        self.loadFile()
        self.file_entries = {}
        self.endianess = "big"

    def loadFile(self):
        self.data = open(self.f_path, mode="rb").read()

    def save_blob(self, index):
        open("blob/file-" + str(index),
             "wb+").write(self.get_blob(index))

    def get_version(self):
        return self.data[:4]

    def build_filetable(self):
        header_offset = 8
        entry_length = 8

        n_of_files = int.from_bytes(self.data[4:8], byteorder=self.endianess)

        for i in range(0, n_of_files):
            curr_entry = self.data[
                header_offset + i*entry_length:
                header_offset + i*entry_length + entry_length]
            next_offset = int.from_bytes(
                self.data[
                    header_offset + (i+1)*entry_length:
                    header_offset + (i+1)*entry_length + entry_length//2],
                byteorder=self.endianess)
            curr_file = self.file_entries[str(i)] = {}
            curr_file["unpacked_filesize"] = int.from_bytes(
                curr_entry[4:], byteorder=self.endianess) & int("0x1fffffff", 16)
            curr_file["offset"] = int.from_bytes(
                curr_entry[:4], byteorder=self.endianess)
            curr_file["compressed"] = (
                (int.from_bytes(curr_entry[4:], byteorder=self.endianess) >> 29) & 1) == 1
            curr_file["blobsize"] = next_offset - curr_file["offset"] - 4

        # We have to correct the blobsize of the last entrie as it will end at
        # the EOF of the .WAR File
        last_file = self.file_entries[str(n_of_files-1)]
        last_file["blobsize"] = len(self.data) - last_file["offset"] - 4

    def extract_image(self, boundary, size):
        img = Image.frombytes("P", size, data[boundary[0]:boundary[1]])
        img.show()

    def get_blob(self, index):
        entry = self.file_entries[str(index)]
        blob = self.data[entry["offset"]:entry["offset"]+entry["blobsize"]]
        return blob


class Typeguesser():
    def __init__(self, blob=None):
        if blob is not None:
            self.guess(blob)

    # shannon entropy: https://stackoverflow.com/questions/990477/how-to-calculate-the-entropy-of-a-file 2nd post
    def get_entropy(self, blob):
        entropy = 0
        size = len(blob)
        byte_count = map(lambda x: blob.count(x), range(0, 256))

        for count in byte_count:
            if count == 0:
                continue
            p = 1.0 * count / size
            entropy -= p * math.log(p, 256)

        return entropy

    def guess(self, blob):
        kind = filetype.guess(blob)
        if kind is None:
            print("Filetype doesn't know what this is.")
            # do smth useful here like OUR guessing
            # print(self.is_in_ascii_range(blob))
        else:
            return kind

    def is_in_ascii_range(self, blob):
        return all(c < 128 for c in blob)

# http://soundfile.sapp.org/doc/WaveFormat/


def add_wave_header(blob):
    format_length = 16
    wav_fmt = 1
    channels = 1
    sample_rate = 11025
    bits_per_sample = 8
    blog_align = channels * ((bits_per_sample + 7) // 8)
    bytes_per_second = sample_rate * blog_align

    header = struct.pack("4sI4s", b"RIFF", 36 + len(blob), b"WAVE")

    fmt = struct.pack("4sIHHIIHH", b"fmt ", format_length, wav_fmt, channels,
                      sample_rate, bytes_per_second, blog_align, 8)

    data = struct.pack("4sI" + str(len(blob)) + "s", b"data",
                       len(blob), blob)

    return struct.pack("12s24s" + str(len(data)) + "s", header, fmt, data)


def setup():
    if not os.path.exists("audio/"):
        os.mkdir("audio/")


if __name__ == "__main__":
    setup()

    file_oi = Path(__file__).parent / "War Data"
    w = WarExtractor(file_oi)
    t = Typeguesser()
    # print(w.get_version())
    w.build_filetable()
    # print(w.file_entries)

    # remove 0 size blobs
    print("Removing empty blobs...")
    files = list(filter(lambda x: len(x) != 0, map(
        lambda x: w.get_blob(x), range(len(w.file_entries)))))

    print("Found", len(w.file_entries), "blobs,", len(files), "not empty")

    print("Searching for palettes..")
    palettes = list(filter(lambda x: len(x) == PALETTE_LENGTH, map(
        lambda x: w.get_blob(x), range(len(w.file_entries)))))

    for pal in range(len(palettes)):
        open("palettes/palette-" + str(pal) + ".pal",
             "wb+").write(palettes[pal])

    index = int(input("Save index no: "))
    w.save_blob(index)

    """

    limit = int(input("Filesize limit in kb: "))
    start = int(input("Specify start index: "))

    audio_entropies = []

    for index in range(start, len(files)):
        blob = files[index]
        filesize = (len(blob) + 1023) // 1024

        if (filesize > limit):
            print("File", index, "Size:", filesize,
                  "kb, entropy:", t.get_entropy(blob))
            play_audio = input("Play audio file? (y/n) ")

            if(play_audio.lower() == "y"):
                entropy = t.get_entropy(blob)
                print("Playing file " + str(index) +
                      "... ", end="", flush=True)

                # play first 20kb
                playable = sa.WaveObject(
                    blob[:20000], num_channels=1, bytes_per_sample=1, sample_rate=11025)
                status = playable.play()
                status.wait_done()
                del playable

                is_audio = input("was the file playable? (y/n) ")

                if(is_audio.lower() == "y"):
                    audio_entropies.append(entropy)

                    print("Average audio entropy:", sum(
                        audio_entropies) / float(len(audio_entropies)), "| ", end="")

                    open("audio/file-" + str(index) + ".wav",
                         "wb+").write(add_wave_header(blob))

    while True:
        index = int(input("Choose file blob to analyse: "))
        blob = w.get_blob(index)

        should_analyse = input("Analyse blob? (y/n) ")

        if(should_analyse.lower() == "y"):
            print("Blob entropy:", t.get_entropy(blob))

            file_format = input("Input file format ")
            open("blob."+file_format, "wb+").write(blob)

    # print(blob)
    # open("blob.mid", "wb+").write(blob)
    # print(t.guess(blob))

    for key, val in w.file_entries.items():
        if (w.file_entries[key]["compressed"]):
            print(val)
    """
