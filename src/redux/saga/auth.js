import {put, delay} from "redux-saga/effects";
import Cookies from "universal-cookie";
import axios from "axios";
import * as constants from "../../constants/string";
import * as actions from "../actions/index";


const cookies = new Cookies();

export function* authUserSaga(action) {

    yield put(actions.authStart());
    const authData = {
        username: action.username,
        password: action.password,
        rememberPassword: action.rememberPassword,
        returnSecureToken: true,
    };
    try {
        const {data} = yield axios.post(
            "http://localhost:9000/accounts/login",
            authData
        );
        let {account, token} = data;

        if (authData.rememberPassword === true) {
            yield cookies.set("access_token", token, {path: "/"});
            yield cookies.set("account", account, {path: "/"});
        } else {
            const expirationDate = yield new Date().getTime() + 360000000 * 2;
            yield cookies.set("expirationDate", expirationDate, {path: "/"});
            yield cookies.set("access_token", token, {path: "/"});
            yield cookies.set("account", account, {path: "/"});
            yield put(actions.checkAuthTimeOut(360000));
        }
        yield put(actions.authSuccess(token, account.uuid));


    } catch (e) {
        yield put(actions.authFail("Failed to sign in"));
    }


}

export function* logoutSaga(action) {
    yield cookies.remove("access_token", {path: "/"});
    yield cookies.remove("account", {path: "/"});
    yield cookies.remove("expirationDate", {path: "/"});
    yield localStorage.removeItem("menu-active")
    yield put(actions.logOutSucceed());
}

export function* authCheckTimeOutSaga(action) {
    yield delay(action.expirationTime * 2);
    yield put(actions.authLogout());
}

export function* authCheckStateSaga(action) {
    const token = yield cookies.get("access_token");
    const userId = yield cookies.get("userID");
    if (!token) {
        yield put(actions.authLogout());
    } else {
        const expirationDate = yield cookies.get("expirationDate");
        const presentTime = yield new Date().getTime();
        if (expirationDate) {
            if (expirationDate <= presentTime) {
                yield put(actions.authLogout());
            } else {
                yield put(actions.authSuccess(token, userId));
                yield put(actions.checkAuthTimeOut(expirationDate - presentTime));
            }
        } else {
            yield put(actions.authSuccess(token, userId));
        }
    }
}
