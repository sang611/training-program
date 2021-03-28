import DashboardPage from "./DashboardPage";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import Cookies from "universal-cookie";
import StudentDashboardPage from "./StudentDashboardPage";
import {Redirect} from "react-router-dom";
import axios from "axios";
import * as actions from '../../redux/actions'

const cookies = new Cookies();
const AccountDashboardPage = () => {
    const {currentUser, userRole} = useSelector(state => state.auth);
    const {isValidToken} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    const dispatch = useDispatch();


    return isValidToken ? (
        userRole === 0 ? <DashboardPage/> : (
            user ? <StudentDashboardPage/> : ''
        )
    ) : <Redirect to="/uet/signin"/>


}

export default AccountDashboardPage;
