import * as actionTypes from '../actions/actionTypes';

const initialState = {
    response: {},
    loading: false,
    getAllSuccess: false,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {


        case actionTypes.GET_ALL_LEARNING_OUTCOME_START:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.GET_ALL_LEARNING_OUTCOME_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                getAllSuccess: true,
                response: action.payload
            }
        case actionTypes.GET_ALL_LEARNING_OUTCOME_FAIL:
            return {
                ...state,
                loading: false,
                getAllSuccess: false,
                error: true,
                response: action.payload
            }

        default:
            return {...state}
    }
}

export default reducer;