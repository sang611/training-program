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

export const getLocOfTrainingProgram = (payload) => {
    return {
        type: actionsTypes.GET_LOC_OF_TRAINING,
        payload
    }
}
export const getLocOfTrainingProgramStart = () => {
    return {
        type: actionsTypes.GET_LOC_OF_TRAINING_START
    }
}
export const getLocOfTrainingProgramSuccess = (payload) => {
    return {
        type: actionsTypes.GET_LOC_OF_TRAINING_SUCCESS,
        payload
    }
}
export const getLocOfTrainingProgramFail = () => {
    return {
        type: actionsTypes.GET_LOC_OF_TRAINING_FAIL
    }
}

export const getCourseOfMatrixTrainingProgram = (payload) => {
    return {
        type: actionsTypes.GET_COURSE_OF_TRAINING,
        payload
    }
}
export const getCourseOfMatrixTrainingProgramStart = () => {
    return {
        type: actionsTypes.GET_COURSE_OF_TRAINING_START
    }
}
export const getCourseOfMatrixTrainingProgramSuccess = (payload) => {
    return {
        type: actionsTypes.GET_COURSE_OF_TRAINING_SUCCESS,
        payload
    }
}
export const getCourseOfMatrixTrainingProgramFail = () => {
    return {
        type: actionsTypes.GET_COURSE_OF_TRAINING_FAIL
    }
}