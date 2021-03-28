import * as actionsTypes from './actionTypes'

export const getAllMajor = () => {
    return {
        type: actionsTypes.GET_ALL_MAJOR
    }
}
export const getAllMajorStart = () => {
    return {
        type: actionsTypes.GET_ALL_MAJOR_START
    }
}
export const getAllMajorSuccess = (payload) => {
    return {
        type: actionsTypes.GET_ALL_MAJOR_SUCCESS,
        payload: payload
    }
}
export const getAllMajorFail = (payload) => {
    return {
        type: actionsTypes.GET_ALL_MAJOR_FAIL,
        payload
    }
}