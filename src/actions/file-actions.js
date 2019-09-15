import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;

export const getFileList = () => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        const snapshot = await firestore().collection('userfiles').doc(uid).collection('files')
        .get();
        if(snapshot && snapshot.docs) {
            var userFiles = [];
            snapshot.docs.forEach(doc => userFiles.push({id: doc.id, ...doc.data()}));
            userFiles = _.orderBy(userFiles, 'originalFile.createDate', 'desc');
            dispatch({
                type: Utils.ActionTypes.GET_FILE_LIST,
                payload: userFiles
            });
        }

        firestore().collection('userfiles').doc(uid).collection('files')
        .onSnapshot((snapshot) => {
            if(snapshot && snapshot.docs) {
                var userFiles = [];
                snapshot.docs.forEach(doc => userFiles.push({id: doc.id, ...doc.data()}));
                userFiles = _.orderBy(userFiles, 'originalFile.createDate', 'desc');
                dispatch({
                    type: Utils.ActionTypes.GET_FILE_LIST,
                    payload: userFiles
                });
            }   
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
            payload: {
                file
            }
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