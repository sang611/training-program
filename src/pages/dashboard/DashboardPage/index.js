import DashboardPage from "./DashboardPage";
import {useSelector} from "react-redux";
import StudentDashboardPage from "./StudentDashboardPage";
import {Redirect} from "react-router-dom";

const AccountDashboardPage = () => {
    const {userRole} = useSelector(state => state.auth);
    const {isValidToken} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)



    return isValidToken ? (
        userRole < 2 ? <DashboardPage/> : (
            user ? <StudentDashboardPage/> : ''
        )
    ) : <Redirect to="/uet/signin"/>


}

export default AccountDashboardPage;
