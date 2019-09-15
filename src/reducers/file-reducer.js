import _ from 'lodash';
import Utils from '../utils';
const { ActionTypes } = Utils;

export const getFileList = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.GET_FILE_LIST:
            return action.payload;
        case ActionTypes.UPDATE_FILE:
            const { file } = action.payload;
            var newState = [];
            var found = false;
            state.forEach(elem => {
                if(elem.id === file.id) {
                    newState.push(_.clone(file));
                    found = true;
                } else {
                    newState.push(elem);
                }
            });
            if(!found) newState.push(file);
            return newState;
        default:
            return state;
    }
}