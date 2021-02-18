import * as actions from "../actions/index";
import {put} from "redux-saga/effects";
import axios from "../../my.axios";
import {logoutSaga} from "./auth";
import {message} from "antd";
import * as actionTypes from "../actions/actionTypes";

export function* createInstitution(action) {
    yield put(actions.createStart());
    console.log("action", action)

    try {
        const response = yield axios.post("/institutions", action.payload)
        yield put(actions.createSuccess(response));
    } catch (error) {
        if(error.response.status === 401 || error.response.status === 500) {
            yield put(actions.createFail(error.response));
        }
    }
    yield put({type: actionTypes.INSTITUTION_CREATE_RESET})

}

export function* getAllInstitution(action) {
    yield put(actions.getAllInstitutionStart());

    try {
        const response = yield axios.get("/institutions");
        yield put(actions.getAllInstitutionSuccess(response.data.institutions));
    } catch (error) {
        yield put(actions.getAllInstitutionFail());
    }
}