import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllTrainings: null,
    loadingATraining: null,
    trainingPrograms: [],
    trainingProgram: null,
    errorLoadAll: null,
    errorLoadA: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_TRAINING_PROGRAMS_START:
            return {
                ...state,
                loadingAllTrainings: true
            }
        case actionTypes.GET_ALL_TRAINING_PROGRAMS_SUCCESS:
            return {
                ...state,
                loadingAllTrainings: false,
                trainingPrograms: action.payload.data.training_programs,
                errorLoadAll: null
            }
        case actionTypes.GET_ALL_TRAINING_PROGRAMS_FAIL:
            return {
                ...state,
                loadingAllTrainings: false,
                errorLoadAll: action.payload,
                trainingPrograms: []
            }

        case actionTypes.GET_A_TRAINING_PROGRAMS_START:
            return {
                ...state,
                loadingATraining: true,
            }
        case actionTypes.GET_A_TRAINING_PROGRAMS_SUCCESS:
            return {
                ...state,
                loadingATraining: false,
                trainingProgram: action.payload.data.trainingProgram,
                errorLoadA: null
            }
        case actionTypes.GET_A_TRAINING_PROGRAMS_FAIL:
            return {
                ...state,
                loadingATraining: false,
                errorLoadA: action.payload,
                trainingProgram: null
            }
        default:
            return {...state}
    }
}

export default reducer