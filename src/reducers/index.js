import { combineReducers } from 'redux';

import AppReducer from './app-reducer';

export default combineReducers({
    language: AppReducer.setLanguage,
    supportedLanguages: AppReducer.setSupportedLanguages
})