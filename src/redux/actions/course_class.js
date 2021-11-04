import * as actionsTypes from './actionTypes'

export const getAllCourseClass = () => {
    return {
        type: actionsTypes.GET_ALL_COURSE_CLASS
    }
}
export const getAllCourseClassStart = () => {
    return {
        type: actionsTypes.GET_ALL_COURSE_CLASS_START
    }
}
export const getAllCourseClassSuccess = (payload) => {
    return {
        type: actionsTypes.GET_ALL_COURSE_CLASS_SUCCESS,
        payload: payload
    }
}
export const getAllCourseClassFail = (payload) => {
    return {
        type: actionsTypes.GET_ALL_COURSE_CLASS_FAIL,
        payload
    }
}