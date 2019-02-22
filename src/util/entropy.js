import { countBy } from 'lodash/collection';
import * as FileTypes from './../constants/filetypes';

const byteRange = [...new Array(256)].map((_, i) => i);

const log256 = val => Math.log(val) / Math.log(256);

const getEntropy = blob => {
    let entropy = 0;
    const size = blob.byteLength;

    const byte_count = countBy(blob);

    for (let pos of byteRange) {
        if (!byte_count[pos]) {
            continue;
        }

        let p = (1.0 * byte_count[pos]) / size;
        entropy -= p * log256(p);
    }

    return entropy;
};

const isAudio = val => val >= 0.66;
const isPallette = val => val >= 0.5 && val < 0.65;
const isText = val => val <= 0.25;

export const predict = val => {
    if (val === 0) return FileTypes.PLACEHOLDER;
    else if (isAudio(val)) return FileTypes.AUDIO;
    else if (isPallette(val)) return FileTypes.PALTETTE;
    else if (isText(val)) return FileTypes.TEXT;
    else {
        return FileTypes.IMAGE;
    }
};

export default getEntropy;
