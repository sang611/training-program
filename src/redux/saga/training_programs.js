import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllTrainingPrograms({payload}) {

    let vnNameSearch = payload ? payload.vnNameSearch || "" : ""
    try {
        yield put(actions.getAllTrainingProgramStart());
        const response = yield axios.get(`/training-programs`, {
            params: {
                vn_name: vnNameSearch
            }
        });
        yield put(actions.getAllTrainingProgramSuccess(response));
    } catch (error) {
        if(error.response)
            yield put(actions.getAllTrainingProgramFail(error.response.data.message));
        else
            yield put(actions.getAllTrainingProgramFail(error.message));
    }
}

export function* getATrainingProgram({payload}) {
    const {id} = payload;
    try {
        yield put(actions.getATrainingProgramStart());
        const response = yield axios.get(`/training-programs/${id}`);
        yield put(actions.getATrainingProgramSuccess(response));
    } catch (e) {
        if(e.response) {
            yield put(actions.getATrainingProgramFail(e.response.data.message));
        }
        else {
            yield put(actions.getATrainingProgramFail(e.message));
        }
    }
}

export function* getLocsMatrixTraining({payload}) {
    const {id} = payload;
    try {
        yield put(actions.getLocOfTrainingProgramStart());
        const response = yield axios.get(`/training-programs/${id}/locs/matrix`);
        yield put(actions.getLocOfTrainingProgramSuccess(response.data.trainingProgram.learning_outcomes));
    } catch (e) {
        if(e.response) {
            yield put(actions.getLocOfTrainingProgramFail(e.response.data.message));
        }
        else {
            yield put(actions.getLocOfTrainingProgramFail(e.message));
        }
    }
}

export function* getCoursesMatrixTraining({payload}) {
    const {id} = payload;
    try {
        yield put(actions.getCourseOfMatrixTrainingProgramStart());
        const response = yield axios.get(`/training-programs/${id}/courses/matrix`);
        yield put(actions.getCourseOfMatrixTrainingProgramSuccess(
            {
                courses: response.data.trainingProgram.courses,
                requireSummary: response.data.trainingProgram.require_summary
            }
        ));
    } catch (e) {
        if(e.response) {
            yield put(actions.getCourseOfMatrixTrainingProgramFail(e.response.data.message));
        }
        else {
            yield put(actions.getCourseOfMatrixTrainingProgramFail(e.message));
        }
    }
}