import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllMajor() {
    try {
        yield put(actions.getAllMajorStart());
        const response = yield axios.get(
            `/majors`
        );
        yield put(actions.getAllMajorSuccess(response.data.majors));
    } catch (error) {
        yield put(actions.getAllMajorFail(error.response));
    }
}