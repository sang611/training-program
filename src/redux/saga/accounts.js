import {put} from 'redux-saga/effects';

import * as actions from '../actions/index';
import * as items from '../../constants/Items';
import axios from "axios";
import * as actionTypes from "../actions/actionTypes";

export function* fetchAccountsSaga(action) {
    try {
        let {typeAccount, page} = action.payload;
        yield put(actions.fetchAccountsStart());

        let api;
        if (typeAccount === 'GV') {

            const params = {
                fullname: action.payload.fullname || "",
                vnu_mail: action.payload.vnu_mail || "",
                academic_rank: action.payload.academic_rank || "",
                academic_degree: action.payload.academic_degree || "",
                institutionUuid: action.payload.institutionUuid || "",
                page: page || 1
            }

            api = `/employees`;
            let {data} = yield axios.get(api, {params});
            yield put(actions.fetchAccountsSuccess(data));
        }
        else if (typeAccount === "SV") {

            const params = {
                fullname: action.payload.fullname || "",
                student_code: action.payload.student_code || "",
                class: action.payload.class,
                grade: action.payload.grade,
                majorUuid: action.payload.majorUuid,
                page: page || 1
            }

            api = `/students`;
            let {data} = yield axios.get(api, {params});
            yield put(actions.fetchAccountsSuccess(data));
        }



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
    const {values, typeAccount} = action.payload;
    yield put(actions.addAccountStart({typeAccount}));
    try {

        if (typeAccount === 1) {
            yield axios.post("/employees", values)
        } else if (typeAccount === 2) {
            yield axios.post("/students", values)
        }

        yield put(actions.addAccountSuccess());
    } catch (error) {
        if(error.response) {
            yield put(actions.addAccountFail(error.response.data.message));
        }
        else {
            yield put(actions.addAccountFail(error.message));
        }
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
