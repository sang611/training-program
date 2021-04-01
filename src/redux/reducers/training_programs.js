import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllTrainings: null,
    trainingPrograms: [],
    errors: null
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
            }
        case actionTypes.GET_ALL_TRAINING_PROGRAMS_FAIL:
            return {
                ...state,
                loadingAllTrainings: false,
                errors: action.payload.data.message,
            }
        default:
            return {...state}
    }
}

export default reducer