import Utils from '../utils';
const { ActionTypes } = Utils;

const INITIAL_STATE = {
    openedIndex: -1
}

export const setEditorFocus = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.EDITOR_FOCUS:
            return action.payload;
        default:
            return state;
    }
}

export const handleTimeChange = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.HANDLE_TIME_CHANGE:
            return action.payload;
        default:
            return state;
    }
}

export const getPlayerStatus = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.IS_PLAYING:
            return action.payload;
        default:
            return state;
    }
}

export const setCurrentSpeakerBox = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.CURRENT_SPEAKER_BOX:
            return action.payload;
        default:
            return state;
    }
}