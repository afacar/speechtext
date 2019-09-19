import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;

export const login = (data) => {
    return async (dispatch, getState) => {
        const response = await firestore().collection('users').doc(data.uid).get()
        .catch(error => {
            console.log('error');
        });
        
        if(_.isEmpty(response) || _.isEmpty(response.data())) {
            const demoPlan = _.find(getState()['plans'], ['type', 'Demo']);
            data = {...data, currentPlan: demoPlan};
            data.currentPlan.remainingMinutes = demoPlan.quota;
            await firestore().collection('users')
            .doc(data.uid)
            .set(data);
        } else {
            data = response.data();
        }
        dispatch({
            type: Utils.ActionTypes.LOGIN,
            payload: data
        });

        firestore().collection('users').doc(data.uid).onSnapshot((snapshot) => {
            var data = {};
            if(snapshot && snapshot.data && snapshot.data()) {
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
