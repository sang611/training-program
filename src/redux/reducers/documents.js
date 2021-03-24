import * as actionTypes from '../actions/actionTypes';

const initialState = {
    response: {},
    loading: false,
    getAllSuccess: false,
    documents: [],
    error: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_DOCUMENT_START:
            return {
                ...state,
                loading: true
            }

        case actionTypes.GET_ALL_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                response: action.payload,
                documents: action.payload.data.documents
            }

        case actionTypes.GET_ALL_DOCUMENT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.data.message,

            }

        default:
            return {...state}
    }
}

export default reducer
