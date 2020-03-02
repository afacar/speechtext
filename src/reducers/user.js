import Utils from '../utils';
const { ActionTypes } = Utils;

export const getTransactions = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.GET_TRANSACTIONS:{
            return action.payload;
        }
        default:
            return state;
    }
}