import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;

export const getFileList = () => {
    return (dispatch, getState) => {
        const { user } = getState();
        firestore().collection('userfiles').doc(user.uid).collection('files')
        .onSnapshot((snapshot) => {
            if(snapshot && snapshot.docs) {
                const { selectedFile } = getState();
                var userFiles = [];
                var deletedFiles = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data();
                    if(data.status === 'DELETED') {
                        deletedFiles.push({id: doc.id, ...doc.data()});
                    } else {
                        userFiles.push({id: doc.id, ...doc.data()})
                    }
                });
                userFiles = _.orderBy(userFiles, 'originalFile.createDate', 'desc');
                dispatch({
                    type: Utils.ActionTypes.GET_FILE_LIST,
                    payload: userFiles
                });
                if(!_.isEmpty(selectedFile)) {
                    var file =_.find(userFiles, { id: selectedFile.id });
                    if(file) {
                        dispatch({
                            type: Utils.ActionTypes.SET_SELECTED_FILE,
                            payload: file
                        });
                    } else {
                        file =_.find(deletedFiles, { id: selectedFile.id });
                        if(file) {
                            dispatch({
                                type: Utils.ActionTypes.SET_SELECTED_FILE,
                                payload: {}
                            });
                        }
                    }
                }
            }
        });
    }
}

export const addFile = (file) => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        
        await firestore().collection('userfiles').doc(uid).collection('files').doc(file.id)
        .set(file);

        await firestore().collection('userfiles').doc(uid).collection('files').doc(file.id).collection('progress').doc('status')
        .set({
            state: file.status
        });
    }
}

export const updateFile = (file, data) => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        await firestore().collection('userfiles').doc(uid).collection('files').doc(file.id)
        .update(data);
        dispatch({
            type: Utils.ActionTypes.UPDATE_FILE,
            payload: file
        });
    }
}

export const updateFileState = (fileId, newState) => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        await firestore().collection('userfiles').doc(uid).collection('files').doc(fileId).collection('progress').doc('status')
        .update({ state: newState });
    }
}

export const updateFileInState = (fileId, data) => {
    return {
        type: Utils.ActionTypes.UPDATE_FILE_IN_STATE,
        payload: {
            fileId,
            data
        }
    }
}

export const setFileToUpload = (file) => {
    return {
        type: Utils.ActionTypes.SET_FILE_TO_UPLOAD,
        payload: file
    }
}

export const setSelectedFile = (file) => {
    return {
        type: Utils.ActionTypes.SET_SELECTED_FILE,
        payload: file
    }
}
