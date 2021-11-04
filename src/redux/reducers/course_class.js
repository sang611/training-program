import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllCourseClasses: null,
    courseClasses: [],
    errors: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_COURSE_CLASS_START:
            return {
                ...state,
                loadingAllCourseClasses: true
            }
        case actionTypes.GET_ALL_COURSE_CLASS_SUCCESS:
            return {
                ...state,
                loadingAllCourseClasses: false,
                courseClasses: action.payload,
            }
        case actionTypes.GET_ALL_COURSE_CLASS_FAIL:
            return {
                ...state,
                loadingAllCourseClasses: false,
                errors: action.payload,
            }
        default:
            return {...state}
    }
}

export default reducer