import { combineReducers } from 'redux';

import AppReducer from './app-reducer';
import AuthReducer from './auth-reducer';

export default combineReducers({
    language: AppReducer.setLanguage,
    supportedLanguages: AppReducer.setSupportedLanguages,
    user: AuthReducer
})