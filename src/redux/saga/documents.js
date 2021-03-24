import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllDocument(action) {
    yield put(actions.getAllDocumentStart());

    try {
        const response = yield axios.get("/documents");
        yield put(actions.getAllDocumentSuccess(response));
    } catch (error) {
        yield put(actions.getAllDocumentFail(error.response));
    }
}
