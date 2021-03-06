import * as actions from "../actions/index";
import {put} from "redux-saga/effects";
import axios from "../../my.axios";
import {logoutSaga} from "./auth";
import {message} from "antd";
import * as actionTypes from "../actions/actionTypes";


export function* getAllLearningOutcomes(action) {
    let {typeLoc, content, page, title} = action.payload
    content = content ? content : "";
    page = page ? page : 1;
    title = title ? title : "";
    typeLoc = typeLoc ? typeLoc : 1;

    yield put(actions.getAllLearningOutcomesStart());

    try {
        const response =
            yield axios.get(
                `/learning-outcomes/${typeLoc}`,
                {
                    params: {
                        content,
                        page,
                        title
                    }
                }
            );
        yield put(actions.getAllLearningOutcomesSuccess(response));
    } catch (error) {
        yield put(actions.getAllLearningOutcomesFail(error.response));
    }
}

export function* getAllLearningOutcomeTitles(action) {
    yield put(actions.getAllLearningOutcomeTitlesStart());

    try {
        const response = yield axios.get(`/learning-outcome-titles/${action.payload}`);
        yield put(actions.getAllLearningOutcomeTitlesSuccess(response));
    } catch (error) {
        yield put(actions.getAllLearningOutcomeTitlesFail(error.response));
    }
}
