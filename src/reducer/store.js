/*
store {
    id: {
        name: string,
        blob: TypedUint8Array,
        filetype: string
    }
}
*/
import { STORE_BLOB, SET_FILENAME, SET_FILETYPE } from './../actions/store';

import * as FileTypes from './../constants/filetypes';

const default_store = {};

const store = (state = default_store, action) => {
    switch (action.type) {
        case STORE_BLOB: {
            return {
                ...state,
                [action.id]: {
                    ...action.id,
                    blob: action.blob,
                    name: action.id,
                    filetype: FileTypes.UNKNOWN
                }
            };
        }
        case SET_FILETYPE: {
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    filetype: action.filetype
                }
            };
        }
        case SET_FILENAME: {
            const store = Object.entries(state).reduce((acc, [key, value]) => {
                if (key === action.old) {
                    return {
                        ...acc,
                        [action.old]: {
                            ...value,
                            name: action.name
                        }
                    };
                }

                return {
                    ...acc,
                    [key]: value
                };
            }, {});

            return store;
        }
        default: {
            return state;
        }
    }
};

export default store;
