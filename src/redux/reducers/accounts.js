import * as actionTypes from '../actions/actionTypes';

const initialState = {
    accounts: [],
    updatedAccounts: [],
    filteredAccounts: [],
    isSearch: false,
    isFilter: false,
    error: null,
    user: null,
    loading: false
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_ACCOUNTS_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ACCOUNTS_SUCCESS:
            return {
                ...state,
                error: null,
                isSearch: false,
                isFilter: false,
                accounts: action.payload
            }
        case actionTypes.FETCH_ACCOUNTS_FAIL: 
            return {
                ...state,
                accounts: [],
                error: action.error
            }
        case actionTypes.ADD_ACCOUNT_START: 
            return {
                ...state,
                error: null
            }
        case actionTypes.ADD_ACCOUNT_SUCCESS:
            return {
                ...state,
                error: false
            }
        case actionTypes.ADD_ACCOUNT_FAIL: 
            return {
                ...state,
                error: action.error
            }
        case actionTypes.SEARCH_ACCOUNTS_SUCCESS:
            return {
                ...state,
                error: null,
                isSearch: true,
                isFilter: false,
                updatedAccounts: action.updatedAccounts
            }
        case actionTypes.FILTER_ACCOUNTS_SUCCESS:
            return {
                ...state,
                error: null,
                isSearch: false,
                isFilter: true,
                filteredAccounts: action.filteredAccounts
            }
        case actionTypes.GET_A_USER_START:
            return {
                loading: true
            }
        case actionTypes.GET_A_USER_SUCCESS:
            return {
                loading: false,
                user: action.payload,
                error: null
            }
        case actionTypes.GET_A_USER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
}

export default (state, action) =>
    reducer(action.type === actionTypes.ADD_ACCOUNT_RESET ? undefined : state, action);