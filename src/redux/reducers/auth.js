import * as actionTypes from '../actions/actionTypes';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authPath: '/accounts',
    isValidToken: false,
    isTokenCheckDone: false,
    user: null,
    currentUser: null,
    userRole: -1
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.AUTH_START:
            return {
                ...state,
                error: null,
                loading: true
            }
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                error: null,
                token: action.idToken,
                userId: action.userId,
                user: action.user,
                isValidToken: true,
                loading: false
            }
        case actionTypes.AUTH_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false
            }
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                token: null,
                userId: null,
                isValidToken: false
            }
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return {
                ...state,
                authPath: action.path
            }
        case actionTypes.GET_VALID_TOKEN:
            return {
                ...state,
                isValidToken: action.validToken
            }
        case actionTypes.TOKEN_CHECK_DONE:
            return {
                ...state,
                isTokenCheckDone: action.tokenCheckDone

            }

        case actionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.currentUser,
                userRole: action.currentUser.role
            }

        default:
            return state;
    }
}

export default reducer;
