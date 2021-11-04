import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllCourseClass() {
    try {
        yield put(actions.getAllCourseClassStart());
        const response = yield axios.get(
            `/course-class`
        );
        yield put(actions.getAllCourseClassSuccess(response.data.courseClasses));
    } catch (error) {
        yield put(actions.getAllCourseClassFail(error.response));
    }
}