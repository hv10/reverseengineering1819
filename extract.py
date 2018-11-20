from pathlib import Path
import sys
import filetype
from PIL import Image 

class WarExtractor():
    def __init__(self,f_path):
        self.f_path = Path(f_path)
        self.loadFile()
        self.file_entries = {}
        self.endianess = "big"
    
    def loadFile(self):
        self.data = open(self.f_path, mode="rb").read()

    def get_version(self):
        return self.data[:4]

    def build_filetable(self):
        header_offset = 8
        entry_length = 8

        n_of_files = int.from_bytes(self.data[4:8],byteorder=self.endianess)

        for i in range(0,n_of_files):
            curr_entry = self.data[
                header_offset + i*entry_length:
                header_offset + i*entry_length + entry_length]
            next_offset = int.from_bytes(
                self.data[
                    header_offset + (i+1)*entry_length:
                    header_offset + (i+1)*entry_length + entry_length//2], 
                byteorder = self.endianess)
            curr_file = self.file_entries[str(i)] = {}
            curr_file["unpacked_filesize"] = int.from_bytes(curr_entry[4:], byteorder=self.endianess) & int("0x1fffffff", 16) 
            curr_file["offset"] = int.from_bytes(curr_entry[:4], byteorder=self.endianess)
            curr_file["compressed"] = ((int.from_bytes(curr_entry[4:],byteorder=self.endianess)>>29)&1)==1
            curr_file["blobsize"] = next_offset - curr_file["offset"] - 4
        
        # We have to correct the blobsize of the last entrie as it will end at 
        # the EOF of the .WAR File
        last_file = self.file_entries[str(n_of_files-1)] 
        last_file["blobsize"] = len(self.data) - last_file["offset"] - 4 


    def extract_image(self,boundary,size):
        img = Image.frombytes("P",size,data[boundary[0]:boundary[1]])
        img.show()

    def get_blob(self, index):
        entry = self.file_entries[str(index)]
        blob = self.data[entry["offset"]:entry["offset"]+entry["blobsize"]]
        return blob

class Typeguesser():
    def __init__(self, blob=None):
        if blob is not None:
            self.guess(blob)

    def guess(self, blob):
        kind = filetype.guess(blob)
        if kind is None:
            print("Filetype doesn't know what this is.")
            # do smth useful here like OUR guessing
            # print(self.is_in_ascii_range(blob))
        else:
            return kind

    def is_in_ascii_range(self,blob):
        return all(c < 128 for c in blob)

if __name__=="__main__":
    file_oi = Path("./War Data")
    w = WarExtractor(file_oi)
    t = Typeguesser()
    print(w.get_version())
    w.build_filetable()
    print(w.file_entries)
    while True:
        index = int(input("index>"))
        blob = w.get_blob(index)
        print(blob)
        open("blob.mid","wb+").write(blob)
        print(t.guess(blob))
    
    for key, val in w.file_entries.items():
        if (w.file_entries[key]["compressed"]):print(val)
