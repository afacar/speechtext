import Utils from '../utils';
import publicIp from 'public-ip';
const { firestore, auth, functions } = Utils.firebase;

const db = firestore();

export const login = (data) => {
    return async (dispatch, getState) => {
        const { uid } = data;
        db.doc(`users/${uid}`).onSnapshot(async (snapshot) => {
            let userData = data;
            if (snapshot && snapshot.data && snapshot.data()) {
                const { emailVerified } = snapshot.data()
                userData = snapshot.data();
                if (emailVerified === false && data.emailVerified === true) {
                    db.doc(`users/${uid}`).update({ emailVerified: true })
                    userData.emailVerified = true
                }
            } else if (data.isNewUser) {
                let ip = '';
                try {
                    ip = await publicIp.v4();
                } catch (error) {
                    console.log('Cannot get user IP adress')
                }
                //const demoPlan = _.find(getState()['plans'], ['type', 'Demo']);
                userData = { ...data, ip };
                delete userData.isNewUser;
                try {
                    console.log('Creating new user... userData:', userData)
                    var fncCreateUser = functions().httpsCallable('createNewUser');
                    let res = await fncCreateUser(userData).data
                    !data.emailVerified && auth().currentUser.sendEmailVerification()
                    console.log('res of new user creation:', res)
                } catch (err) {
                    console.log('createNewUser returns error:', err)
                }
            }
            dispatch({
                type: Utils.ActionTypes.LOGIN,
                payload: userData
            });
        }, (error) => {
            // TODO: GET_USER_PROFILE_ERROR
            console.log(error)
        });

    }
}

export const logout = () => {
    return {
        type: Utils.ActionTypes.LOGOUT,
        payload: {}
    }
}