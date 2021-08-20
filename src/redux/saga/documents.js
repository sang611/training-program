import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllDocument(action) {
    yield put(actions.getAllDocumentStart());
    let {doc_of, title, resourceUuid} = action.payload;
    let titleSearch = title ? title : '';
    try {
        const response = yield axios.get(
            `/documents/${doc_of}`,
            {
                params: {
                    name: titleSearch,
                    resourceUuid: resourceUuid
                }
            }
        );
        yield put(actions.getAllDocumentSuccess(response));
    } catch (error) {
        yield put(actions.getAllDocumentFail(error.response));
    }
}
