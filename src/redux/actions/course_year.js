import * as actionsTypes from './actionTypes'

export const getAllCourseYear = () => {
    return {
        type: actionsTypes.GET_ALL_COURSE_YEAR
    }
}
export const getAllCourseYearStart = () => {
    return {
        type: actionsTypes.GET_ALL_COURSE_YEAR_START
    }
}
export const getAllCourseYearSuccess = (payload) => {
    return {
        type: actionsTypes.GET_ALL_COURSE_YEAR_SUCCESS,
        payload: payload
    }
}
export const getAllCourseYearFail = (payload) => {
    return {
        type: actionsTypes.GET_ALL_COURSE_YEAR_FAIL,
        payload
    }
}