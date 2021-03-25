import './App.css';
import {Route, Switch} from 'react-router-dom'
import SignInPage from './pages/SignInPage/SignInPage';
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./private.route";
import Cookies from "universal-cookie";
import {useDispatch, useSelector} from "react-redux";
import * as actions from './redux/actions'
import jwt from 'jsonwebtoken'
import {useEffect} from "react";


const cookies = new Cookies();
const token = cookies.get('access_token')

function App() {



    return (
        <div className="App">
            <Switch>
                <Route exact={true} path="/uet/signin" component={SignInPage}/>
                <PrivateRoute>
                    <Route path="/" component={DashboardPage}/>
                </PrivateRoute>
            </Switch>
        </div>
    );
}

export default App;
