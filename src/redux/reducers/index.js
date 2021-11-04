import {combineReducers} from "redux";
import authReducer from './auth';
import accountsReducer from './accounts'
import institutionsReducer from "./institutions";
import coursesReducer from "./courses"
import learningOutcomesReducer from "./learningOutcomes";
import learningOutcomeTitlesReducer from "./learningOutcomeTitles";
import documentReducer from "./documents"
import majorReducer from './majors'
import trainingTypeReducer from './training_program_types'
import training_programs from "./training_programs";
import notifications from "./notifications";
import courseClassReducer from './course_class'
import courseYearReducer from './course_year'

const rootReducer = combineReducers({
    auth: authReducer,
    accounts: accountsReducer,
    institutions: institutionsReducer,
    courses: coursesReducer,
    learningOutcomes: learningOutcomesReducer,
    learningOutcomeTitles: learningOutcomeTitlesReducer,
    documents: documentReducer,
    majors: majorReducer,
    trainingTypes: trainingTypeReducer,
    trainingPrograms: training_programs,
    notifications: notifications,
    courseClass: courseClassReducer,
    courseYear: courseYearReducer
});

export default (state, action) =>
    rootReducer(action.type === 'AUTH_LOGOUT' ? undefined : state, action);