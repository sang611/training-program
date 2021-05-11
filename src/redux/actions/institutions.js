import * as actionTypes from './actionTypes';

export const createInstitution = (institution) => {
    return {
        type: actionTypes.INSTITUTION_CREATE,
        payload: institution
    }

}

export const createStart = () => {
    return {
        type: actionTypes.INSTITUTION_CREATE_START,
    }

}

export const createSuccess = (response) => {
    return {
        type: actionTypes.INSTITUTION_CREATE_SUCCESS,
        payload: response
    }
}

export const createFail = (response) => {
    return {
        type: actionTypes.INSTITUTION_CREATE_FAIL,
        payload: response
    }
}

export const getAllInstitution = (payload) => {
    return {
        type: actionTypes.INSTITUTION_GET_ALl,
        payload: payload
    }
}
export const getAllInstitutionStart = () => {
    return {
        type: actionTypes.INSTITUTION_GET_ALl_START
    }
}
export const getAllInstitutionSuccess = (payload) => {
    return {
        type: actionTypes.INSTITUTION_GET_ALl_SUCCESS,
        payload: payload
    }
}
export const getAllInstitutionFail = () => {
    return {
        type: actionTypes.INSTITUTION_GET_ALl_FAIL
    }
}


