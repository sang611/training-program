import './App.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom'
import SignInPage from './pages/SignInPage/SignInPage';
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./private.route";
import {useDispatch} from "react-redux";
import * as actions from './redux/actions'
import axios from "axios";
import ForbiddenPage from "./pages/ForbiddenPage/ForbiddenPage";


function App() {

    const history = useHistory();
    const dispatch = useDispatch();

    axios.defaults.baseURL = "http://112.137.129.236/:9000"
    axios.interceptors.response.use( (response) => {
        // Return a successful response back to the calling service
        return response;
    }, (error) => {
        // Return any error which is not due to authentication back to the calling service

        if (error.response.status === 401) {
            dispatch(actions.authLogout())
        }
        else if (error.response.status === 403) {
            history.push("/forbidden")
        }
        return Promise.reject(error);
    })

    return (
        <div className="App">
            <Switch>
                <Route exact path="/forbidden" component={ForbiddenPage} />
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
