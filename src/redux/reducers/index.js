import {combineReducers} from "redux";
import authReducer from './auth';
import accountsReducer from './accounts'
import institutionsReducer from "./institutions";
import coursesReducer from "./courses"
import learningOutcomesReducer from "./learningOutcomes";
import learningOutcomeTitlesReducer from "./learningOutcomeTitles";
import documentReducer from "./documents"
import majorReducer from './majors'

const rootReducer = combineReducers({
    auth: authReducer,
    accounts: accountsReducer,
    institutions: institutionsReducer,
    courses: coursesReducer,
    learningOutcomes: learningOutcomesReducer,
    learningOutcomeTitles: learningOutcomeTitlesReducer,
    documents: documentReducer,
    majors: majorReducer
});

export default (state, action) =>
    rootReducer(action.type === 'AUTH_LOGOUT' ? undefined : state, action);