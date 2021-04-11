import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllTrainingPrograms({payload}) {

    let url = "";
    if(payload) {
        let vnNameSearch = payload.vnNameSearch ? payload.vnNameSearch : ""
        url = `/training-programs/?vn_name=${vnNameSearch}`;
    } else {
        url = `/training-programs/?vn_name=`
    }

    try {
        yield put(actions.getAllTrainingProgramStart());
        const response = yield axios.get(url);
        yield put(actions.getAllTrainingProgramSuccess(response));
    } catch (error) {
        if(error.response)
            yield put(actions.getAllTrainingProgramFail(error.response.data.message));
        else
            yield put(actions.getAllTrainingProgramFail(error.message));
    }
}

export function* getATrainingProgram({payload}) {
    const {id} = payload;
    try {
        yield put(actions.getATrainingProgramStart());
        const response = yield axios.get(`/training-programs/${id}`);
        yield put(actions.getATrainingProgramSuccess(response));
    } catch (e) {
        if(e.response) {
            yield put(actions.getATrainingProgramFail(e.response.data.message));
        }
        else {
            yield put(actions.getATrainingProgramFail(e.message));
        }
    }
}