import Utils from '../utils';
const { firestore } = Utils.firebase;

export const updateProfile = (data) => {
    console.log('updateProfile called with:', data)
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        const { displayName, email, country, address } = data;
        var userData = { displayName, email, country, address };

        await firestore().collection('users').doc(uid).update(userData)
            .then(res => console.log('profile updated!', res))
            .catch(error => {
                // TODO: UPDATE_USER_PROFILE_ERROR
                console.log(error);
            });
    }
}