import Utils from '../utils';
const { firestore } = Utils.firebase;

export const getFileList = () => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        const snapshot = await firestore().collection('userfiles').doc(uid).collection('files')
        .orderBy('createDate', 'desc')
        .get();
        if(snapshot && snapshot.docs) {
            var userFiles = [];
            snapshot.docs.forEach(doc => userFiles.push({id: doc.id, ...doc.data()}));
            dispatch({
                type: Utils.ActionTypes.GET_FILE_LIST,
                payload: userFiles
            });
        }
    }
}
