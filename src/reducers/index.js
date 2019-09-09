import { combineReducers } from 'redux';

import AppReducer from './app-reducer';

export default combineReducers({
    language: AppReducer.language,
    supportedLanguages: AppReducer.setSupportedLanguages
})