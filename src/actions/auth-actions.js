import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;

const db = firestore();

export const login = (data) => {
    return async (dispatch, getState) => {
        const { uid } = data;
        db.doc(`users/${uid}`).onSnapshot(async (snapshot) => {
            let userData = data;
            if (snapshot && snapshot.data && snapshot.data()) {
                userData = snapshot.data();
            } else if (data.isNewUser) {
                const demoPlan = _.find(getState()['plans'], ['type', 'Demo']);
                userData = { ...data, currentPlan: demoPlan };
                userData.currentPlan.remainingMinutes = demoPlan.quota;
                delete userData.isNewUser;
    
                await db.doc(`users/${uid}`).set(userData)
                    .catch(error => {
                        // TODO: SET_USER_PROFILE_ERROR
                        console.log(error);
                    })
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