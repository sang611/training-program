import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllTrainingType() {
    try {
        yield put(actions.getAllTrainingTypeStart());
        const response = yield axios.get(
            `/training-program-types`
        );
        yield put(actions.getAllTrainingTypeSuccess(response.data.trainingProgramTypes));
    } catch (error) {
        yield put(actions.getAllTrainingTypeFail(error.response));
    }
}