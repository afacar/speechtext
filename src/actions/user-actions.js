import Utils from '../utils';
const { firestore, auth } = Utils.firebase;

export const updateProfile = (data) => {
    console.log('updateProfile called with:', data)
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        const { displayName, email, country, address } = data;
        var userData = { displayName, email, country, address };
        var user = auth().currentUser;

        try {
            console.log('setting displayName ', displayName)
            await user.updateProfile({ displayName })
            // Email and Password change requires reauthentication
            // https://medium.com/@ericmorgan1/change-user-email-password-in-firebase-and-react-native-d0abc8d21618
            //await user.updateEmail(email)
            console.log('setting profile ', userData)
            await firestore().collection('users').doc(uid).update(userData)
        } catch (error) {
            // TODO: UPDATE_USER_PROFILE_ERROR
            console.log(error)
        }

    }
}