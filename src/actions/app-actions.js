import Utils from '../utils';
import publicIp from 'public-ip';

const { firestore, functions } = Utils.firebase;

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
        firestore().collection('plans').doc('standard')
            .get()
            .then(snapshot => {
                if (snapshot) {
                    //var plans = [];
                    //snapshot.docs.forEach(doc => plans.push({ id: doc.id, ...doc.data() }));
                    dispatch({
                        type: Utils.ActionTypes.GET_PLANS,
                        payload: snapshot.data()
                    });
                }
            })
            .catch(error => {
                // TODO: GET_PLANS_ERROR
                console.log(error);
            })
    }
}

export const submitContactForm = (form) => {
    return async (dispatch) => {
        var ip = await publicIp.v4();
        console.log('client ip is:', ip)
        return new Promise(async (resolve, reject) => {
            if (!ip)
                reject('No IP found. Weird error!')

            let counterDoc = await firestore().doc(`contactSubmissions/${ip}`).get()
            let numSubmissions = counterDoc && counterDoc.data() && counterDoc.data().counter;

            if (numSubmissions > 50)
                return reject('Too much submission:/ Spam Alert!')

            form.createdAt = new Date()
            var contactUs = functions().httpsCallable('contactUs');
            const { nameSurname, email, opinions } = form
            let text = opinions
            contactUs({ nameSurname, email, text })
                .then(res => {
                    console.log('The form is submitted!')
                    resolve('Thanks for your inquiry:) We will be in touch soon.')
                })
                .catch(error => {
                    // TODO: SET_CONTACT_FORM_ERROR
                    console.log(error);
                    reject('Network error:< Try again please!')
                })
        })

    }
}

export const getErrorDefinitions = (language) => {
    return dispatch => {
        firestore().collection('error_definitions').doc(language)
            .get()
            .then(snapshot => {
                if (snapshot) {
                    var errorDefinitions = [];
                    var data = snapshot.data();
                    Object.keys(data).forEach(key => {
                        errorDefinitions.push({
                            key,
                            value: data[key]
                        })
                    })
                    dispatch({
                        type: Utils.ActionTypes.GET_ERROR_DEFINITIONS,
                        payload: errorDefinitions
                    });
                }
            })
            .catch(error => {
                // TODO: GET_PLANS_ERROR
                console.log(error);
            })
    }
}