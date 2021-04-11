import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllDocument(action) {
    yield put(actions.getAllDocumentStart());
    let {doc_of, title} = action.payload;
    let titleSearch = title ? title : '';
    try {
        const response = yield axios.get(`/documents/${doc_of}?name=${titleSearch}`);
        yield put(actions.getAllDocumentSuccess(response));
    } catch (error) {
        yield put(actions.getAllDocumentFail(error.response));
    }
}
