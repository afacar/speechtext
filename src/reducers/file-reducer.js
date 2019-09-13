import Utils from '../utils';
const { ActionTypes } = Utils;
export const getFileList = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.GET_FILE_LIST:
            return action.payload;
        case ActionTypes.INIT_FILE:
            return [action.payload, ...state];
        default:
            return state;
    }
}