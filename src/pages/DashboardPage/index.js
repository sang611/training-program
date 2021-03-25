import DashboardPage from "./DashboardPage";
import {useSelector} from "react-redux";
import {useState, useEffect} from "react";
import Cookies from "universal-cookie";
import StudentDashboardPage from "./StudentDashboardPage";
import {Redirect} from "react-router-dom";
import axios from "axios";

const cookies = new Cookies();
const AccountDashboardPage = () => {
    const {currentUser, userRole} = useSelector(state => state.auth);
    const {isValidToken} = useSelector(state => state.auth)

    return isValidToken ? (
        userRole === 0 ? <DashboardPage /> : <StudentDashboardPage />
    ) : <Redirect to="/uet/signin"/>

}

export default AccountDashboardPage;
