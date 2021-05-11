import * as actions from "../actions/index";
import {put} from "redux-saga/effects";
import axios from "../../my.axios";
import {logoutSaga} from "./auth";
import {message} from "antd";
import * as actionTypes from "../actions/actionTypes";


export function* getAllCourse(action) {

    yield put(actions.getAllCourseStart());

    try {
        const response = yield axios.get(
            `/courses`, {
                params: action.payload ?
                    action.payload.params :
                    {
                        course_name_vi: "",
                        course_name_en: "",
                        course_code: ""
                    }
            }
        );
        yield put(actions.getAllCourseSuccess(response));
    } catch (error) {
        yield put(actions.getAllCourseFail(error.response));
    }
}

export function* getACourse(action) {
    const {courseUuid} = action.payload;
    yield put(actions.getACourseStart());

    try {
        const response = yield axios.get(`/courses/${courseUuid}`);
        yield put(actions.getACourseSuccess(response.data.course));
    } catch (error) {
        yield put(actions.getACourseFail(error.response.data.message));
    }
}