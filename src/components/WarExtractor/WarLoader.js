const VERSIONS = {
    PRE_RELEASE: 0xef,
    DOS_SHAREWARE: 0x19,
    DOS_RETAIL: 0x18,
    MAC_SHAREWARE: 0x19,
    MAC_RETAIL: 0x1a
};

const swap16 = ([byte0, byte1]) => [byte1, byte0];
const swap32 = ([byte0, byte1, byte2, byte3]) => [byte3, byte2, byte1, byte0];

const intFromBytes = bytes =>
    bytes.reduce(
        (acc, cur, index) => acc + (cur << ((bytes.length - index - 1) * 8)),
        0
    );

class WarLoader {
    constructor(data) {
        this.data = new Uint8Array(data);

        this.version = '';
        this.endianess = '';
        this.file_table = {};
        this.number_of_files = 0;
    }

    //archive id has 4byte
    getVersion() {
        const header = this.data.subarray(0, 4);

        this.version = Object.keys(VERSIONS).find(key =>
            header.find(byte => byte === VERSIONS[key])
        );

        if (this.version.includes('MAC')) {
            this.endianess = 'big';
        } else {
            this.endianess = 'little';
        }
    }

    buildFileTable() {
        const header_length = 8;
        const entry_length = 8;

        const number_header = this.data.subarray(4, 8);
        const number_of_entries =
            this.endianess === 'big' ? number_header : swap32(number_header);

        this.number_of_files = intFromBytes(number_of_entries);

        for (let i = 0; i < this.number_of_files; i++) {
            const offset = header_length + i * entry_length;

            const cur_entry = this.data.slice(offset, offset + entry_length);
            const next_offset = intFromBytes(
                this.data.slice(
                    offset + entry_length,
                    offset + entry_length + parseInt(entry_length / 2)
                )
            );

            const unpacked_filesize =
                intFromBytes(cur_entry.subarray(4)) & 0x1fffffff;
            const file_offset = intFromBytes(cur_entry.subarray(0, 4));

            this.file_table[i] = {
                unpacked_filesize,
                file_offset,
                compressed:
                    ((intFromBytes(cur_entry.subarray(0, 4)) >> 29) & 1) === 1,
                blobsize: next_offset - file_offset // - 4
            };
        }

        //correct last file
        this.file_table[this.number_of_files - 1].blobsize =
            this.data.byteLength -
            this.file_table[this.number_of_files - 1].file_offset;
    }

    isValid() {
        return !!this.version;
    }
}

export default WarLoader;
