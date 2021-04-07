import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loadingAllNotification: false,
    notifications: [],
    error: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_NOTIFICATION_START:
            return {
                ...state,
                loadingAllNotification: true
            }
        case actionTypes.GET_ALL_NOTIFICATION_SUCCESS:
            return {
                ...state,
                loadingAllNotification: false,
                notifications: action.payload,
                error: null
            }
        case actionTypes.GET_ALL_NOTIFICATION_FAIL:
            return {
                ...state,
                loadingAllNotification: false,
                notifications: [],
                error: action.payload,
            }
        default:
            return {...state}
    }
}

export default reducer