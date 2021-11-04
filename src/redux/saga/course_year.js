import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllCourseYear() {
    try {
        yield put(actions.getAllCourseYearStart());
        const response = yield axios.get(
            `/course-years`
        );
        yield put(actions.getAllCourseYearSuccess(response.data.courseYears));
    } catch (error) {
        yield put(actions.getAllCourseYearFail(error.response));
    }
}