import * as actionTypes from '../actions/actionTypes';

const initialState = {
    response: {},
    loading: false,
    getAllSuccess: false,
    locTitles: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE_START:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                getAllSuccess: true,
                locTitles: action.payload.data.learningOutcomeTitles,
                response: action.payload
            }
        case actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE_FAIL:
            return {
                ...state,
                loading: false,
                getAllSuccess: false,
                error: true,
                locTitles: [],
                response: action.payload
            }

        default:
            return {...state}
    }
}

export default reducer;