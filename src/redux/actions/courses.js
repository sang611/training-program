import * as actionTypes from "./actionTypes";

export const getAllCourse = () => {
    return {
        type: actionTypes.GET_ALL_COURSE
    }
}
export const getAllCourseStart = () => {
    return {
        type: actionTypes.GET_ALL_COURSE_START
    }
}
export const getAllCourseSuccess = (payload) => {
    return {
        type: actionTypes.GET_ALL_COURSE_SUCCESS,
        payload: payload
    }
}
export const getAllCourseFail = (payload) => {
    return {
        type: actionTypes.GET_ALL_COURSE_FAIL,
        payload: payload
    }
}
