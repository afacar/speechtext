import { combineReducers } from 'redux';
import AppReducer from './app-reducer';
import AuthReducer from './auth-reducer';
import { getFileList, setSelectedFile } from './file-reducer';

export default combineReducers({
    language: AppReducer.setLanguage,
    supportedLanguages: AppReducer.setSupportedLanguages,
    user: AuthReducer,
    plans: AppReducer.plans,
    userFiles: getFileList,
    selectedFile: setSelectedFile
})