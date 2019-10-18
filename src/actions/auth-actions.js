import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;


export const login = (data) => {
    return async (dispatch, getState) => {
        const response = await firestore().collection('users').doc(data.uid).get()
            .catch(error => {
                // TODO: GET_USER_PROFILE_ERROR
                console.log(error);
            })
        const { uid } = data;
        //_.isEmpty(response) || _.isEmpty(response.data())
        if (data.isNewUser) {
            const demoPlan = _.find(getState()['plans'], ['type', 'Demo']);
            data = { ...data, currentPlan: demoPlan };
            data.currentPlan.remainingMinutes = demoPlan.quota;
            delete data.isNewUser;
            await firestore().doc(`users/${uid}`).set(data)
                .catch(error => {
                    // TODO: SET_USER_PROFILE_ERROR
                    console.log(error);
                })
        } else {
            data = !_.isEmpty(response) && !_.isEmpty(response.data()) ? response.data() : data;
        }
        dispatch({
            type: Utils.ActionTypes.LOGIN,
            payload: data
        });
    }
}

export const logout = () => {
    return {
        type: Utils.ActionTypes.LOGOUT,
        payload: {}
    }
}