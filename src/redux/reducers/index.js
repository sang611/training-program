import {combineReducers} from "redux";
import authReducer from './auth';
import accountsReducer from './accounts'
import institutionsReducer from "./institutions";

const rootReducer = combineReducers({
    auth: authReducer,
    accounts: accountsReducer,
    institutions: institutionsReducer
});

export default (state, action) =>
    rootReducer(action.type === 'AUTH_LOGOUT' ? undefined : state, action);