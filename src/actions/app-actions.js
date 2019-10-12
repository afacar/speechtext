import Utils from '../utils';
const { firestore } = Utils.firebase;

export const setLanguage = (language) => {
    return {
        type: Utils.ActionTypes.SET_LANGUAGE,
        payload: language
    }
}

export const setSupportedLanguages = (languages) => {
    return {
        type: Utils.ActionTypes.SET_SUPPORTED_LANGUAGES,
        payload: languages
    }
}

export const getPlans = () => {
    return dispatch => {
        firestore().collection('plans').orderBy('order')
            .get()
            .then(snapshot => {
                if (snapshot) {
                    var plans = [];
                    snapshot.docs.forEach(doc => plans.push({ id: doc.id, ...doc.data() }));
                    dispatch({
                        type: Utils.ActionTypes.GET_PLANS,
                        payload: plans
                    });
                }
            })
            .catch(error => {
                // TODO: GET_PLANS_ERROR
                console.log(error);
            })
    }
}