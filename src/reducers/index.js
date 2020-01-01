import { combineReducers } from 'redux';
import AppReducer from './app-reducer';
import AuthReducer from './auth-reducer';
import { getFileList, setSelectedFile, setUploadingFiles } from './file-reducer';
import { handleTimeChange, getPlayerStatus, setEditorFocus } from "./editor-reducer";
import { getTransactions } from './user';

export default combineReducers({
    language: AppReducer.setLanguage,
    supportedLanguages: AppReducer.setSupportedLanguages,
    user: AuthReducer,
    plans: AppReducer.plans,
    errorDefinitions: AppReducer.errorDefinitions,
    userFiles: getFileList,
    selectedFile: setSelectedFile,
    uploadingFiles: setUploadingFiles,
    handleTimeChange: handleTimeChange,
    playerStatus: getPlayerStatus,
    editorFocus: setEditorFocus,
    transactions: getTransactions,
})