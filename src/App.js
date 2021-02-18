import './App.css';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom'
import SignInPage from './pages/SignInPage/SignInPage';
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import PrivateRoute from "./private.route";

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
