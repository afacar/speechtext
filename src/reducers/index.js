import { combineReducers } from 'redux';
import AppReducer from './app-reducer';
import AuthReducer from './auth-reducer';
import { getFileList, setSelectedFile, setUploadingFiles } from './file-reducer';
import { handleTimeChange, getPlayerStatus, setEditorFocus, setCurrentSpeakerBox } from "./editor-reducer";
import { getTransactions } from './user';

const { setLanguage, setSupportedLanguages, plans, errorDefinitions, trimmedFileInfo } = AppReducer;
export default combineReducers({
    language: setLanguage,
    supportedLanguages: setSupportedLanguages,
    user: AuthReducer,
    plans,
    errorDefinitions,
    userFiles: getFileList,
    selectedFile: setSelectedFile,
    uploadingFiles: setUploadingFiles,
    handleTimeChange: handleTimeChange,
    playerStatus: getPlayerStatus,
    editorFocus: setEditorFocus,
    transactions: getTransactions,
    selectedSpeakerBox: setCurrentSpeakerBox,
    trimmedFileInfo
})