import * as actionsTypes from './actionTypes'

export const getAllTrainingType = () => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_TYPE
    }
}
export const getAllTrainingTypeStart = () => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_TYPE_START
    }
}
export const getAllTrainingTypeSuccess = (payload) => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_TYPE_SUCCESS,
        payload: payload
    }
}
export const getAllTrainingTypeFail = (payload) => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_TYPE_FAIL,
        payload
    }
}