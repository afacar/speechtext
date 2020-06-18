import Utils from '../utils';
import _ from 'lodash';

const setLanguage = (state = 'en-US', action) => {
    switch (action.type) {
        case Utils.ActionTypes.SET_LANGUAGE:
            return action.payload || 'en-US';
        default:
            return state;
    }
}

const DEFAULT_SUPPORTED_LANGUAGES = [
    {
        key: 'tr-TR',
        value: 'Türkçe'
    },
    {
        key: 'en-US',
        value: 'English'
    }
]

const setSupportedLanguages = (state = DEFAULT_SUPPORTED_LANGUAGES, action) => {
    switch (action.type) {
        case Utils.ActionTypes.SET_SUPPORTED_LANGUAGES:
            return action.payload;
        default:
            return state;
    }
}

const getPlans = (state = [], action) => {
    switch (action.type) {
        case Utils.ActionTypes.GET_PLANS:
            return action.payload;
        default:
            return state;
    }
}

const getErrorDefinitions = (state = [], action) => {
    switch (action.type) {
        case Utils.ActionTypes.GET_ERROR_DEFINITIONS:
            return action.payload;
        default:
            return state;
    }
}

const setTrimmedFileInfo = (state = {}, action) => {
    const { fileId } = action.payload || {};
    switch (action.type) {
        case Utils.ActionTypes.SET_TRIMMED_FILE_INFO:
            if (!_.isEmpty(state)) {
                var newState = _.remove(state, (file) => {
                    return fileId !== file.id;
                });
                return newState;
            }
            return action.payload;
        default:
            return state;
    }
}

export default {
    setLanguage,
    setSupportedLanguages,
    plans: getPlans,
    errorDefinitions: getErrorDefinitions,
    trimmedFileInfo: setTrimmedFileInfo
}