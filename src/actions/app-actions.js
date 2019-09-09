import Utils from '../utils';

export const setLanguage = (language) => {
    return {
        type: Utils.ActionTypes.SET_LANGUAGE,
        payload: language
    }
}

export const setSupportedLanguages = (languages) => {
    return {
        type: Utils.ActionTypes.SET_SUPPORTED_LANGUAGES,
        payload: languages
    }
}