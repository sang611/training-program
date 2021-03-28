import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllMajor: null,
    majors: [],
    errors: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_MAJOR_START:
            return {
                ...state,
                loadingAllMajor: true
            }
        case actionTypes.GET_ALL_MAJOR_SUCCESS:
            return {
                ...state,
                loadingAllMajor: false,
                majors: action.payload,
            }
        case actionTypes.GET_ALL_MAJOR_FAIL:
            return {
                ...state,
                loadingAllMajor: false,
                errors: action.payload,
            }
        default:
            return {...state}
    }
}

export default reducer