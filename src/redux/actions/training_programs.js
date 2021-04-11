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

export const getATrainingProgram = (payload) => {
    return {
        type: actionsTypes.GET_A_TRAINING_PROGRAMS,
        payload
    }
}
export const getATrainingProgramStart = () => {
    return {
        type: actionsTypes.GET_A_TRAINING_PROGRAMS_START
    }
}
export const getATrainingProgramSuccess = (payload) => {
    return {
        type: actionsTypes.GET_A_TRAINING_PROGRAMS_SUCCESS,
        payload: payload
    }
}
export const getATrainingProgramFail = (payload) => {
    return {
        type: actionsTypes.GET_A_TRAINING_PROGRAMS_FAIL,
        payload
    }
}