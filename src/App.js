import './App.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom'
import SignInPage from './pages/SignInPage/SignInPage';
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./private.route";
import Cookies from "universal-cookie";
import {useDispatch, useSelector} from "react-redux";
import * as actions from './redux/actions'
import jwt from 'jsonwebtoken'
import {useEffect} from "react";
import axios from "axios";




function App() {

    const dispatch = useDispatch();

    axios.defaults.baseURL = "http://localhost:9000"
    axios.interceptors.response.use( (response) => {
        // Return a successful response back to the calling service
        return response;
    }, (error) => {
        // Return any error which is not due to authentication back to the calling service

        if (error.response.status === 401) {
            dispatch(actions.authLogout())
        }
        return Promise.reject(error);
    })

    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={()=><Redirect to="/uet/training-programs" />} />
                <Route exact={true} path="/uet/signin" component={SignInPage}/>
                <PrivateRoute>
                    <Route path="/" component={DashboardPage}/>
                </PrivateRoute>
            </Switch>
        </div>
    );
}

export default App;
