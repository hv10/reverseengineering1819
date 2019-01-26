export const STORE_BLOB = 'STORE_BLOB';
export const SET_FILETYPE = 'SET_FILETYPE';
export const SET_FILENAME = 'SET_FILENAME';

export const storeBlob = (id, blob) => ({
    type: STORE_BLOB,
    id,
    blob
});

export const setFileType = (id, filetype) => ({
    type: SET_FILETYPE,
    id,
    filetype
});

export const setFileName = (old, name) => ({
    type: SET_FILENAME,
    old,
    name
});
