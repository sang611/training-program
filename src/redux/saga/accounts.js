import {put} from 'redux-saga/effects';

import * as actions from '../actions/index';
import * as items from '../../constants/Items';
import axios from "axios";
import * as actionTypes from "../actions/actionTypes";

function hasNumber(myString) {
    return /\d/.test(myString);
}

export function* fetchAccountsSaga(action) {
    try {
        let {typeAccount, fullnameSearch, studentClass, page} = action.payload;
        fullnameSearch = fullnameSearch || "";
        studentClass = studentClass || "";

        if(studentClass === "Tất cả") studentClass = ""

        let vnu_mail = "";

        if(hasNumber(fullnameSearch) || fullnameSearch.includes("@")) {
            vnu_mail = fullnameSearch;
            fullnameSearch = "";
        }

        yield put(actions.fetchAccountsStart());

        let api;
        if (typeAccount === 'GV') {
            api = `/employees?fullname=${fullnameSearch}&vnu_mail=${vnu_mail}&page=${page || 1}`;
        }
        else if (typeAccount === "SV") {
            api = `/students?fullname=${fullnameSearch}&vnu_mail=${vnu_mail}&class=${studentClass}&page=${page || 1}`;
        }

        const {data} = api ? yield axios.get(api) : [];
        yield put(actions.fetchAccountsSuccess(data));
    } catch (error) {
        console.log(error)
        yield put(actions.fetchAccountsFail(error));
    }
}

export function* searchAccountsSaga(action) {
    if (action.searchValue.trim() === '') {
        yield put(actions.fetchAccountsSuccess(action.accounts));
    } else {
        const tempAccounts = [];
        for (var i = 0; i < action.accounts.length; i++) {
            let tempString = action.accounts[i].fullName;
            let n = yield tempString.toUpperCase().search(action.searchValue.toUpperCase());
            if (n >= 0) {
                yield tempAccounts.push(action.accounts[i]);
            }
        }
        yield put(actions.searchAccountsSuccess(tempAccounts));
    }
}

export function* filterAccountsSaga(action) {
    if (action.role === 'All') {
        yield put(actions.fetchAccountsSuccess(action.accounts));
    } else {
        const tempAccounts = [];
        for (var i = 0; i < action.accounts.length; i++) {
            let tempRole = action.accounts[i].role;
            if (tempRole === action.role) {
                yield tempAccounts.push(action.accounts[i]);
            }
        }
        yield put(actions.filterAccountsSuccess(tempAccounts));
    }
}


export function* addAccountSaga(action) {
    yield put(actions.addAccountStart());
    try {
        const {values, typeAccount} = action.payload;
        console.log(action.payload)
        if (typeAccount == 1) {
            yield axios.post("/employees", values)
        } else if (typeAccount == 2) {
            yield axios.post("/students", values)
        }

        yield put(actions.addAccountSuccess({typeAccount}));
    } catch (error) {
        yield put(actions.addAccountFail(error));
    }
    yield put({type: actionTypes.ADD_ACCOUNT_RESET});
}

export function* getAUser(action) {
    yield put(actions.getAUserStart());
    try {
        const {accountUuid, role} = action.payload;
        const {data} = yield axios.get(`/accounts/${accountUuid}`)
        yield put(actions.getAUserSuccess(data.user))
    } catch (e) {
        yield put(actions.getAUserFail(e))
    }
}

export function* getDetailUser(action) {
    yield put(actions.getDetailUserStart());
    try {
        const {accountUuid, role} = action.payload;
        const {data} = yield axios.get(`/accounts/${accountUuid}`)
        yield put(actions.getDetailUserSuccess(data.user))
    } catch (e) {
        yield put(actions.getDetailUserFail(e))
    }
}
