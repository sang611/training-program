import * as actionTypes from "./actionTypes";

export const getAllCourse = (payload) => {
    return {
        type: actionTypes.GET_ALL_COURSE,
        payload: payload
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

export const getACourse = (payload) => {
    return {
        type: actionTypes.GET_A_COURSE,
        payload
    }
}
export const getACourseStart = () => {
    return {
        type: actionTypes.GET_A_COURSE_START
    }
}
export const getACourseSuccess = (payload) => {
    return {
        type: actionTypes.GET_A_COURSE_SUCCESS,
        payload: payload
    }
}
export const getACourseFail = (payload) => {
    return {
        type: actionTypes.GET_A_COURSE_FAIL,
        payload: payload
    }
}

