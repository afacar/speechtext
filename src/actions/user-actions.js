import _ from 'lodash';
import Utils from '../utils';
const { firestore } = Utils.firebase;

export const updateProfile = (data) => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        const { name, surname, email, phone, country, city, zipCode, openAddress, identityNumber} = data;
        var userData = { name, surname, email, phone };
        var addressData = { country, city, zipCode, openAddress, identityNumber };
        userData.address = addressData;
        await firestore().collection('users').doc(uid).update(userData);
    }
}