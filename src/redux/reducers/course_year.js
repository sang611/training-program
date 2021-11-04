import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllCourseYears: null,
    courseYears: [],
    errors: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_COURSE_YEAR_START:
            return {
                ...state,
                loadingAllCourseYears: true
            }
        case actionTypes.GET_ALL_COURSE_YEAR_SUCCESS:
            return {
                ...state,
                loadingAllCourseYears: false,
                courseYears: action.payload,
            }
        case actionTypes.GET_ALL_COURSE_YEAR_FAIL:
            return {
                ...state,
                loadingAllCourseYears: false,
                errors: action.payload,
            }
        default:
            return {...state}
    }
}

export default reducer