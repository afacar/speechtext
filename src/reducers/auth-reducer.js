import Utils from '../utils';

const auth = (state = {}, action) => {
    switch (action.type) {
        case Utils.ActionTypes.LOGIN:
            return action.payload;
        case Utils.ActionTypes.LOGOUT:
            return action.payload;
        default:
            return state;
    }
}

export default auth;