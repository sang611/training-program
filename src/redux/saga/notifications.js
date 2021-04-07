import {put} from "redux-saga/effects";
import * as actions from "../actions";
import axios from "../../my.axios";

export function* getAllNotification() {
    try {
        yield put(actions.getAllNotificationStart());
        const response = yield axios.get(
            `/tickets`
        );
        yield put(actions.getAllNotificationSuccess(response.data.tickets));
    } catch (error) {
            yield put(actions.getAllNotificationFail(error));
    }
}