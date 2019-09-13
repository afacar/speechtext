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
            const demoPlan = _.find(getState()['plans'], ['type', 'DEMO']);
            data = {...data, currentPlan: demoPlan};
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
    }
}

export const logout = () => {
    return {
        type: Utils.ActionTypes.LOGOUT,
        payload: {}
    }
}
