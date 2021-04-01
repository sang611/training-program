import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllTrainingPrograms() {
    try {
        yield put(actions.getAllTrainingProgramStart());
        const response = yield axios.get(
            `/training-programs`
        );
        yield put(actions.getAllTrainingProgramSuccess(response));
    } catch (error) {
        yield put(actions.getAllTrainingProgramFail(error.response));
    }
}