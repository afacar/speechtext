import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import AppReducer from './app-reducer';
import AuthReducer from './auth-reducer';
import { getFileList, setSelectedFile } from './file-reducer';

export default combineReducers({
    form: formReducer,
    language: AppReducer.setLanguage,
    supportedLanguages: AppReducer.setSupportedLanguages,
    user: AuthReducer,
    plans: AppReducer.plans,
    userFiles: getFileList,
    selectedFile: setSelectedFile
})