import * as actions from "../actions/index";
import {put} from "redux-saga/effects";
import axios from "../../my.axios";
import {logoutSaga} from "./auth";
import {message} from "antd";
import * as actionTypes from "../actions/actionTypes";


export function* getAllLearningOutcomes(action) {
    yield put(actions.getAllLearningOutcomesStart());

    try {
        const response = yield axios.get("/learning-outcomes");
        yield put(actions.getAllLearningOutcomesSuccess(response));
    } catch (error) {
        yield put(actions.getAllLearningOutcomesFail(error.response));
    }
}