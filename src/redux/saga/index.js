import {takeEvery} from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import {authUserSaga, logoutSaga, authCheckTimeOutSaga, authCheckStateSaga} from './auth';
import {fetchAccountsSaga, searchAccountsSaga, filterAccountsSaga, addAccountSaga, getAUser, getDetailUser} from './accounts';
import * as institutionSaga from "./institutions";
import * as courseSaga from './courses'
import * as learningOutcomeSaga from "./learningOutcomes"
import * as documentSaga from './documents'
import * as majorSaga from './majors'
import * as trainingTypeSaga from './training_program_type'
import * as trainingProgramSaga from './training_programs'
import * as notificationSaga from './notifications'
import * as courseClass from './course_class'
import * as courseYear from './course_year'

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_USER, authUserSaga);
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
    //yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, authCheckTimeOutSaga);
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga);
    yield takeEvery(actionTypes.FETCH_ACCOUNTS, fetchAccountsSaga);
    yield takeEvery(actionTypes.SEARCH_ACCOUNTS, searchAccountsSaga);
    yield takeEvery(actionTypes.FILTER_ACCOUNTS, filterAccountsSaga);
    yield takeEvery(actionTypes.ADD_ACCOUNT, addAccountSaga);
    yield takeEvery(actionTypes.GET_A_USER, getAUser);
    yield takeEvery(actionTypes.GET_DETAIL_USER, getDetailUser);

    yield takeEvery(actionTypes.INSTITUTION_CREATE, institutionSaga.createInstitution);
    yield takeEvery(actionTypes.INSTITUTION_GET_ALl, institutionSaga.getAllInstitution);

    yield takeEvery(actionTypes.GET_ALL_COURSE, courseSaga.getAllCourse);
    yield takeEvery(actionTypes.GET_A_COURSE, courseSaga.getACourse);

    yield takeEvery(actionTypes.GET_ALL_LEARNING_OUTCOME, learningOutcomeSaga.getAllLearningOutcomes);
    yield takeEvery(actionTypes.GET_ALL_LEARNING_OUTCOME_TITLE, learningOutcomeSaga.getAllLearningOutcomeTitles);

    yield takeEvery(actionTypes.GET_ALL_DOCUMENT, documentSaga.getAllDocument)

    yield takeEvery(actionTypes.GET_ALL_MAJOR, majorSaga.getAllMajor);

    yield takeEvery(actionTypes.GET_ALL_TRAINING_TYPE, trainingTypeSaga.getAllTrainingType);
    yield takeEvery(actionTypes.GET_ALL_COURSE_CLASS, courseClass.getAllCourseClass);
    yield takeEvery(actionTypes.GET_ALL_COURSE_YEAR, courseYear.getAllCourseYear);

    yield takeEvery(actionTypes.GET_ALL_TRAINING_PROGRAMS, trainingProgramSaga.getAllTrainingPrograms);
    yield takeEvery(actionTypes.GET_A_TRAINING_PROGRAMS, trainingProgramSaga.getATrainingProgram);

    yield takeEvery(actionTypes.GET_LOC_OF_TRAINING, trainingProgramSaga.getLocsMatrixTraining);
    yield takeEvery(actionTypes.GET_COURSE_OF_TRAINING, trainingProgramSaga.getCoursesMatrixTraining);

    yield takeEvery(actionTypes.GET_ALL_NOTIFICATION, notificationSaga.getAllNotification)
}


