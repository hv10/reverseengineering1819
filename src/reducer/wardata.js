import { SAVE_WARDATA } from './../actions/wardata';

const default_wardata = {
    data: null,
    version: null,
    endianess: '',
    file_table: {}
};

const wardata = (state = default_wardata, action) => {
    switch (action.type) {
        case SAVE_WARDATA: {
            return {
                data: action.data,
                version: action.version,
                endianess: action.endianess,
                file_table: action.file_table
            };
        }
        default: {
            return state;
        }
    }
};

export default wardata;
