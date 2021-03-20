import * as actionTypes from './actionTypes';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId, user) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
        user: user
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const auth = ({username, password, rememberPassword}) => {
    return {
        type: actionTypes.AUTH_USER,
        username: username,
        password: password,
        rememberPassword: rememberPassword
    }
}

export const authLogout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    }
}

export const logOutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeOut = (expirationTime) => {
    return  {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime: expirationTime
    }
}

export const authCheckState = () => {
    return {
        type: actionTypes.AUTH_CHECK_STATE
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const setIsValidToken = (isValid) => {
    return {
        type: actionTypes.GET_VALID_TOKEN,
        validToken: isValid
    }
}

export const setTokenCheckDone = (isDone) => {
    return {
        type: actionTypes.TOKEN_CHECK_DONE,
        tokenCheckDone: isDone
    }
}

