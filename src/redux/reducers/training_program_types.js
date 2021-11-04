import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllTrainingTypes: null,
    trainingProgramTypes: [],
    errors: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_TRAINING_TYPE_START:
            return {
                ...state,
                loadingAllTrainingTypes: true
            }
        case actionTypes.GET_ALL_TRAINING_TYPE_SUCCESS:
            return {
                ...state,
                loadingAllTrainingTypes: false,
                trainingProgramTypes: action.payload,
            }
        case actionTypes.GET_ALL_TRAINING_TYPE_FAIL:
            return {
                ...state,
                loadingAllTrainingTypes: false,
                errors: action.payload,
            }
        default:
            return {...state}
    }
}

export default reducer