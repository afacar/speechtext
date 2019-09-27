import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;


export const login = (data) => {
    return async (dispatch, getState) => {
        const response = await firestore().collection('users').doc(data.uid).get()
            .catch(error => {
                console.log('error', error);
            });
        const { uid } = data;
        //_.isEmpty(response) || _.isEmpty(response.data())
        if (data.isNewUser) {
            const demoPlan = _.find(getState()['plans'], ['type', 'Demo']);
            // split name surname here and add to data object
            const [name, surname] = Utils.getNameSurname(data.displayName)
            data = { ...data, currentPlan: demoPlan, name, surname };
            data.currentPlan.remainingMinutes = demoPlan.quota;
            delete data.isNewUser;
            await firestore().doc(`users/${uid}`).set(data);
        } else {
            data = !_.isEmpty(response) && !_.isEmpty(response.data()) ? response.data() : data;
        }
        dispatch({
            type: Utils.ActionTypes.LOGIN,
            payload: data
        });
        // TOASK: Why do we do 2nd time this
        firestore().collection('users').doc(uid).onSnapshot((snapshot) => {
            var data = {};
            if (snapshot && snapshot.data && snapshot.data()) {
                data = snapshot.data();
            }
            dispatch({
                type: Utils.ActionTypes.LOGIN,
                payload: data
            });
        })
    }
}

export const logout = () => {
    return {
        type: Utils.ActionTypes.LOGOUT,
        payload: {}
    }
}