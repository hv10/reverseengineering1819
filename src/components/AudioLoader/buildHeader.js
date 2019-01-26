/*
const buildWaveHeadesssr = () => {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);

    const format_length = 16
    const wav_fmt = 1
    const channels = 1
    const sample_rate = 11025
    const bits_per_sample = 8
    const blog_align = channels * (Math.floor((bits_per_sample + 7) / 8))
    const bytes_per_second = sample_rate * blog_align

    header = struct.pack("4sI4s", b"RIFF", 36 + len(blob), b"WAVE")

    fmt = struct.pack("4sIHHIIHH", b"fmt ", format_length, wav_fmt, channels,
                      sample_rate, bytes_per_second, blog_align, 8)

    data = struct.pack("4sI" + str(len(blob)) + "s", b"data",
                       len(blob), blob)

    return struct.pack("12s24s" + str(len(data)) + "s", header, fmt, data)
};*/

// https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
function buildWaveHeader(opts) {
    //var numFrames = opts.numFrames;
    var numChannels = 1; //opts.numChannels || 2;
    var sampleRate = 11025; //opts.sampleRate || 44100;
    var bytesPerSample = 1; //opts.bytesPerSample || 2;
    var blockAlign = numChannels * bytesPerSample;
    var byteRate = sampleRate * blockAlign;
    //var dataSize = numFrames * blockAlign;
    var dataSize = opts.size;

    var buffer = new ArrayBuffer(44);
    var dv = new DataView(buffer);

    var p = 0;

    function writeString(s) {
        for (var i = 0; i < s.length; i++) {
            dv.setUint8(p + i, s.charCodeAt(i));
        }
        p += s.length;
    }

    function writeUint32(d) {
        dv.setUint32(p, d, true);
        p += 4;
    }

    function writeUint16(d) {
        dv.setUint16(p, d, true);
        p += 2;
    }

    writeString('RIFF'); // ChunkID
    writeUint32(dataSize + 36); // ChunkSize
    writeString('WAVE'); // Format
    writeString('fmt '); // Subchunk1ID
    writeUint32(16); // Subchunk1Size
    writeUint16(1); // AudioFormat
    writeUint16(numChannels); // NumChannels
    writeUint32(sampleRate); // SampleRate
    writeUint32(byteRate); // ByteRate
    writeUint16(blockAlign); // BlockAlign
    writeUint16(bytesPerSample * 8); // BitsPerSample
    writeString('data'); // Subchunk2ID
    writeUint32(dataSize); // Subchunk2Size

    return buffer;
}

export default buildWaveHeader;
