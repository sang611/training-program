import * as actionTypes from "./actionTypes";

export const getAllDocuments = (payload) => {
    return {
        type: actionTypes.GET_ALL_DOCUMENT,
        payload: payload
    }
}

export const getAllDocumentStart = () => {
    return {
        type: actionTypes.GET_ALL_DOCUMENT_START
    }
}

export const getAllDocumentSuccess = (payload) => {
    return {
        type: actionTypes.GET_ALL_DOCUMENT_SUCCESS,
        payload: payload
    }
}

export const getAllDocumentFail = (payload) => {
    return {
        type: actionTypes.GET_ALL_DOCUMENT_FAIL,
        payload: payload
    }
}
