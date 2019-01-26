export const SAVE_WARDATA = 'SAVE_WARDATA';

export const saveWardata = ({ version, endianess, file_table, data }) => ({
    type: SAVE_WARDATA,
    version,
    endianess,
    file_table,
    data
});
