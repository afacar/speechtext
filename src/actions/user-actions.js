import _ from 'lodash';
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

export const getTransactions = (user) => {
    return (dispatch, getState) => {
        console.log("user", user)
        firestore().collection('payments').doc(user.uid).collection('userbasket').orderBy("requestDate", "desc")
            .onSnapshot((snapshot) => {
                if (snapshot && snapshot.docs) {
                    var transactions = [];
                    snapshot.docs.forEach(doc => {
                        var transcriptionData = doc.data();
                        console.log("doc data ", transcriptionData);
                        var price = transcriptionData.request.price;
                        var currency = transcriptionData.request.currency;
                        if (currency === "USD")
                            currency = "$";
                        else
                            currency = "₺";
                        var status = "";
                        if (transcriptionData.error)
                            status = "fail"
                        else if (transcriptionData.result) {
                            if (transcriptionData.result.status === "success")
                                status = "success"
                            else
                                status = "fail"
                        }
                        console.log("Date ", transcriptionData.requestDate.toDate());
                        var date = transcriptionData.requestDate.toDate();
                        var dateStr = date.toLocaleDateString();

                        var transaction = {
                            basketId: transcriptionData.request.basketId,
                            date: dateStr,
                            amount: transcriptionData.minutes / 60,
                            price: parseFloat(price).toFixed(2),
                            currency,
                            status
                        }
                        transactions.push(transaction);
                    });
                    transactions = _.orderBy(transactions, "date", 'desc');
                    dispatch({
                        type: Utils.ActionTypes.GET_TRANSACTIONS,
                        payload: transactions
                    });
                }
            }, (error) => {
                // TODO: GET_FILE_LIST_ERROR
                console.log(error)
            });
    }
}