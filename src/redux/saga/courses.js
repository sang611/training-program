import * as actions from "../actions/index";
import {put} from "redux-saga/effects";
import axios from "../../my.axios";
import {logoutSaga} from "./auth";
import {message} from "antd";
import * as actionTypes from "../actions/actionTypes";


export function* getAllCourse(action) {
    let course_name_vi = "", course_name_en = "", course_code="";
    if(action.payload){

        course_name_vi = action.payload.course_name_vi;
        course_name_en = action.payload.course_name_en;
        course_code = action.payload.course_code;
    }


    yield put(actions.getAllCourseStart());

    try {
        const response = yield axios.get(
            `/courses/?course_name_vi=${course_name_vi ? course_name_vi : ""}&course_name_en=${course_name_en ? course_name_en : ""}&course_code=${course_code ? course_code : ""}`
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