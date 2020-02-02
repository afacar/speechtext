import Utils from '../utils';
const { ActionTypes } = Utils;

export const getTransactions = (state = [], action) => {
    switch(action.type) {
        case ActionTypes.GET_TRANSACTIONS:{
            console.log("Action payload ", action.payload)
            return action.payload;
        }
        default:
            return state;
    }
}