import _ from 'lodash';
import Utils from '../utils';
const { ActionTypes } = Utils;

export const getFileList = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.GET_FILE_LIST:
            var newState = _.isEmpty(state) ? action.payload : [];
            _.each(action.payload, file => {
                var currentFile =_.find(state, { id: file });
                newState.push(_.merge(file, currentFile));
            });
            return newState;
        case ActionTypes.UPDATE_FILE:
            const file = action.payload;
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
        case ActionTypes.UPDATE_FILE_IN_STATE:
            const { fileId, data } = action.payload;
            var newState = [];
            var found = false;
            state.forEach(elem => {
                if(elem.id === fileId) {
                    var file = _.merge(elem, data);
                    newState.push(file);
                    found = true;
                } else {
                    newState.push(elem);
                }
            });
            return newState;
        case ActionTypes.SET_FILE_TO_UPLOAD:
            if(!_.isEmpty(action.payload)) {
                return [action.payload, ...state]
            }
            return state;
        default:
            return state;
    }
}

export const setSelectedFile = (state = {}, action) => {
    switch(action.type) {
        case ActionTypes.SET_SELECTED_FILE:
            return action.payload;
        default:
            return state;
    }
}