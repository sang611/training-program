import * as actionsTypes from './actionTypes'

export const getAllTrainingProgram = (payload) => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_PROGRAMS,
        payload
    }
}
export const getAllTrainingProgramStart = () => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_PROGRAMS_START
    }
}
export const getAllTrainingProgramSuccess = (payload) => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_PROGRAMS_SUCCESS,
        payload: payload
    }
}
export const getAllTrainingProgramFail = (payload) => {
    return {
        type: actionsTypes.GET_ALL_TRAINING_PROGRAMS_FAIL,
        payload
    }
}