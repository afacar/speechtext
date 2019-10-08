import _ from 'lodash';
import Utils from '../utils';
const { ActionTypes } = Utils;

export const getFileList = (state = [], action) => {
    var found = false;
    var newState = [];
    switch(action.type) {
        case ActionTypes.GET_FILE_LIST:
            return action.payload;
        case ActionTypes.UPDATE_FILE:
            const file = action.payload;
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

export const setUploadingFiles = (state = [], action) => {
    const { fileId } = action.payload || {};
    switch(action.type) {
        case ActionTypes.ADD_TO_UPLOADING_FILES:
            const { fileObj } = action.payload;
            return [...state, { id: fileId, file: fileObj, progress: 0 }];
        case ActionTypes.REMOVE_FROM_UPLOADING_FILES:
            var newState = _.remove(state, (file) => {
                return fileId !== file.id;
            });
            return newState;
        case ActionTypes.SET_UPLOADING_FILE_PROGRESS:
            const { progress } = action.payload;
            return state.map(file => {
                if(file.id === fileId) {
                    return {...file, progress };
                }
                return {...file};
            });
        default:
            return state;
    }
}