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
        const response = yield axios.get(
            url
        );
        yield put(actions.getAllTrainingProgramSuccess(response));
    } catch (error) {
        yield put(actions.getAllTrainingProgramFail(error.response));
    }
}