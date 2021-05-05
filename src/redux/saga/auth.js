import {put, delay} from "redux-saga/effects";
import Cookies from "universal-cookie";
import axios from "axios";
import * as constants from "../../constants/string";
import * as actions from "../actions/index";
import jwt from "jsonwebtoken";


const cookies = new Cookies();

export function* authUserSaga(action) {
    console.log(action)
    yield put(actions.authStart());
    const authData = {
        username: action.username,
        password: action.password,
        rememberPassword: action.rememberPassword,
        returnSecureToken: true,
    };

    const apiUrl = action.uetLogin ? "/accounts/loginWithLDAP" : "/accounts/login";

    try {
        const {data} = yield axios.post(
            apiUrl,
            authData
        );
        let {account, token} = data;

        delete account.password;
        yield put(actions.setCurrentUser(account));


        if (authData.rememberPassword === true) {
            yield cookies.set("access_token", token, {path: "/"});

        } else {
            const expirationDate = yield new Date().getTime() + 360000000 * 2;
           // yield cookies.set("account", account, {path: "/"});
            yield cookies.set("expirationDate", expirationDate, {path: "/"});
            yield cookies.set("access_token", token, {path: "/"});
            yield put(actions.checkAuthTimeOut(360000));
        }
        yield put(actions.authSuccess(token, account.uuid, account));
        yield cookies.set('isAuth', true, {path: "/"});

    } catch (e) {
        yield put(actions.authFail("Failed to sign in"));
        yield cookies.set('isAuth', false, {path: "/"});
    }

}

export function* logoutSaga(action) {
    yield cookies.remove("access_token", {path: "/"});
    yield cookies.remove("account", {path: "/"});
    yield cookies.remove("expirationDate", {path: "/"});
    yield cookies.remove("isAuth", {path: "/"})

    yield localStorage.removeItem("menu-active")
    yield put(actions.logOutSucceed());
}

/*export function* authCheckTimeOutSaga(action) {
    yield delay(action.expirationTime * 2);
    yield put(actions.authLogout());
}*/

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
