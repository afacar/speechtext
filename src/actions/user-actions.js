import Utils from '../utils';
const { firestore } = Utils.firebase;

export const updateProfile = (data) => {
    return async (dispatch, getState) => {
        const { uid } = getState().user;
        const { name, surname, email, phoneNumber, country, city, zipCode, address, identityNumber} = data;
        var userData = { name, surname, email, phoneNumber };
        var addressData = { country, city, zipCode, address, identityNumber };
        // Delete identityNumber field if not available
        if (!identityNumber) delete addressData.identityNumber;
        userData.Billing = addressData;
        await firestore().collection('users').doc(uid).update(userData);
    }
}