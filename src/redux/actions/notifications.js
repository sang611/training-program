import * as actionsTypes from './actionTypes'

export const getAllNotification = () => {
    return {
        type: actionsTypes.GET_ALL_NOTIFICATION
    }
}
export const getAllNotificationStart = () => {
    return {
        type: actionsTypes.GET_ALL_NOTIFICATION_START
    }
}
export const getAllNotificationSuccess = (payload) => {
    return {
        type: actionsTypes.GET_ALL_NOTIFICATION_SUCCESS,
        payload
    }
}
export const getAllNotificationFail = (payload) => {
    return {
        type: actionsTypes.GET_ALL_NOTIFICATION_FAIL,
        payload
    }
}