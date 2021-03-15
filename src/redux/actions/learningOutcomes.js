import * as actionTypes from "./actionTypes";

export const getAllLearningOutcomes = (payload) => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME,
        payload: payload
    }
}
export const getAllLearningOutcomesStart = () => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_START
    }
}
export const getAllLearningOutcomesSuccess = (payload) => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_SUCCESS,
        payload: payload
    }
}
export const getAllLearningOutcomesFail = (payload) => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_FAIL,
        payload: payload
    }
}



export const getAllLearningOutcomeTitles = (payload) => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE,
        payload: payload
    }
}
export const getAllLearningOutcomeTitlesStart = () => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE_START
    }
}
export const getAllLearningOutcomeTitlesSuccess = (payload) => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE_SUCCESS,
        payload: payload
    }
}
export const getAllLearningOutcomeTitlesFail = (payload) => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE_FAIL,
        payload: payload
    }
}
