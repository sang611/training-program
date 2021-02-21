import * as actionTypes from "./actionTypes";

export const getAllLearningOutcomes = () => {
    return {
        type: actionTypes.GET_ALL_LEARNING_OUTCOME
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
