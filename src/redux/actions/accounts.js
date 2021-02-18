import * as actionTypes from './actionTypes';

export const fetchAccountsStart = () => {
    return {
        type: actionTypes.FETCH_ACCOUNTS_START
    }
}

export const fetchAccountsFail = (error) => {
    return {
        type: actionTypes.FETCH_ACCOUNTS_FAIL,
        error: error
    }
}

export const fetchAccountsSuccess = (data) => {
    return {
        type: actionTypes.FETCH_ACCOUNTS_SUCCESS,
        payload: data
    }
}

export const fetchAccounts = (payload) => {
    return {
        type: actionTypes.FETCH_ACCOUNTS,
        payload
    }
}

export const addAccountStart = () => {
    return {
        type: actionTypes.ADD_ACCOUNT_START
    }
}

export const addAccountSuccess = () => {
    return {
        type: actionTypes.ADD_ACCOUNT_SUCCESS,
    }
}

export const addAccountFail = (error) => {
    return {
        type: actionTypes.ADD_ACCOUNT_FAIL,
        error: error
    }
}

export const addAccount = (data) => {
    return {
        type: actionTypes.ADD_ACCOUNT,
        payload: data
    }
}

export const searchAccountsSuccess = (accounts) => {
    return {
        type: actionTypes.SEARCH_ACCOUNTS_SUCCESS,
        updatedAccounts: accounts
    }
}

export const searchAccounts = (value, accounts) => {
    return {
        type: actionTypes.SEARCH_ACCOUNTS,
        searchValue: value,
        accounts: accounts
    }
}

export const filterAccountsSuccess = (accounts) => {
    return {
        type: actionTypes.FILTER_ACCOUNTS_SUCCESS,
        filteredAccounts: accounts
    }
}

export const filterAccounts = (role, accounts) => {
    return {
        type: actionTypes.FILTER_ACCOUNTS,
        role: role,
        accounts: accounts
    }
}