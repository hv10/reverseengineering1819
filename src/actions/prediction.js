export const PREDICT_BLOB = 'PREDICT_BLOB';

export const predictBlob = (id, blob) => ({
    type: PREDICT_BLOB,
    id,
    blob
});
