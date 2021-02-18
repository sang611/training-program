import * as actionTypes from '../actions/actionTypes';

const initialState = {
    response: {},
    loading: false,
    getAllSuccess: false,
    listInstitutions: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INSTITUTION_CREATE_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.INSTITUTION_CREATE_SUCCESS:
            return {
                ...state,
                response: action.payload,
                loading: false
            }
        case actionTypes.INSTITUTION_CREATE_FAIL:
            return {
                ...state,
                response: action.payload,
                loading: false
            }

        case actionTypes.INSTITUTION_GET_ALl_START:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.INSTITUTION_GET_ALl_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                getAllSuccess: true,
                listInstitutions: action.payload
            }
        case actionTypes.INSTITUTION_GET_ALl_FAIL:
            return {
                ...state,
                loading: false,
                getAllSuccess: false,
                error: true
            }

        default:
            return {...state}
    }
}

export default (state, action) =>
    reducer(action.type === actionTypes.INSTITUTION_CREATE_RESET ? undefined : state, action);