import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllTrainings: null,
    loadingATraining: null,
    loadingLocsMatrix: null,
    loadingCoursesMatrix: null,
    trainingPrograms: [],
    trainingProgram: null,
    locsMatrixTraining: [],
    coursesMatrixTraining: [],
    errorLoadAll: null,
    errorLoadA: null,
    errorLoadLocsMatrix: null,
    errorLoadCourseMatrix: null
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
        case actionTypes.GET_LOC_OF_TRAINING_START:
            return {
                ...state,
                loadingLocsMatrix: true,
            }
        case actionTypes.GET_LOC_OF_TRAINING_SUCCESS:
            return {
                ...state,
                loadingLocsMatrix: false,
                locsMatrixTraining: action.payload,
                errorLoadLocsMatrix: null
            }
        case actionTypes.GET_LOC_OF_TRAINING_FAIL:
            return {
                ...state,
                loadingLocsMatrix: false,
                locsMatrixTraining: [],
                errorLoadLocsMatrix: action.payload
            }

        case actionTypes.GET_COURSE_OF_TRAINING_START:
            return {
                ...state,
                loadingCoursesMatrix: true,
            }
        case actionTypes.GET_COURSE_OF_TRAINING_SUCCESS:
            return {
                ...state,
                loadingCoursesMatrix: false,
                coursesMatrixTraining: action.payload,
                errorLoadCoursesMatrix: null
            }
        case actionTypes.GET_COURSE_OF_TRAINING_FAIL:
            return {
                ...state,
                loadingCoursesMatrix: false,
                coursesMatrixTraining: [],
                errorLoadCoursesMatrix: action.payload
            }
        default:
            return {...state}
    }
}

export default reducer