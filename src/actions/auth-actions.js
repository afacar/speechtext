import Utils from '../utils';

export const login = (uid, displayName, email) => {
    return {
        type: Utils.ActionTypes.LOGIN,
        payload: {
            uid,
            displayName,
            email
        }
    }
}

export const logout = () => {
    return {
        type: Utils.ActionTypes.LOGOUT,
        payload: {}
    }
}
