import { OPEN_MODAL, CLOSE_MODAL } from './../actions/dialog';

const default_dialog = {
    open: false,
    id: null
};

const dialog = (state = default_dialog, action) => {
    switch (action.type) {
        case OPEN_MODAL: {
            return {
                open: true,
                id: action.id
            };
        }
        case CLOSE_MODAL: {
            return {
                ...default_dialog
            };
        }
        default: {
            return state;
        }
    }
};

export default dialog;
