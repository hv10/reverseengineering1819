/*
predictions: {
    id: {
        guess: string<filetype>
        entropy: float,
    }
}
*/
import { PREDICT_BLOB } from './../actions/prediction';
import getEntropy, { predict } from './../util/entropy';

const default_prediction = {};

const prediction = (state = default_prediction, action) => {
    switch (action.type) {
        case PREDICT_BLOB: {
            const entropy = getEntropy(action.blob);
            return {
                ...state,
                [action.id]: {
                    entropy,
                    guess: predict(entropy)
                }
            };
        }
        default: {
            return state;
        }
    }
};

export default prediction;
