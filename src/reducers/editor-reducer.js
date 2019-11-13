import _ from 'lodash';
import Utils from '../utils';
const { ActionTypes } = Utils;

export const setEditorFocus = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.EDITOR_FOCUS:
            return action.payload;
        default:
            return state;
    }
}

export const handleTimeChange = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.HANDLE_TIME_CHANGE:
            return action.payload;
        default:
            return state;
    }
}

export const getPlayerStatus = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.IS_PLAYING:
            return action.payload;
        default:
            return state;
    }
}