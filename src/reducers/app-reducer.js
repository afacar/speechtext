import Utils from '../utils';

const setLanguage = (state = 'en', action) => {
    switch(action.type) {
        case Utils.ActionTypes.SET_LANGUAGE:
            return action.payload || 'en';
        default:
            return state;
    }
}

const DEFAULT_SUPPORTED_LANGUAGES = [
    {
        key: 'tr',
        value: 'Türkçe'
    },
    {
        key: 'en',
        value: 'English'
    }
]

const setSupportedLanguages = (state = DEFAULT_SUPPORTED_LANGUAGES, action) => {
    switch(action.type) {
        case Utils.ActionTypes.SET_SUPPORTED_LANGUAGES:
            return action.payload;
        default:
            return state;
    }
}

const getPlans = (state = [], action) => {
    switch(action.type) {
        case Utils.ActionTypes.GET_PLANS:
            return action.payload;
        default:
            return state;
    }
}

const getErrorDefinitions = (state = [], action) => {
    switch(action.type) {
        case Utils.ActionTypes.GET_ERROR_DEFINITIONS:
            return action.payload;
        default:
            return state;
    }
}

export default {
    setLanguage,
    setSupportedLanguages,
    plans: getPlans,
    errorDefinitions: getErrorDefinitions
}