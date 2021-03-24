import './App.css';
import {Route, Switch} from 'react-router-dom'
import SignInPage from './pages/SignInPage/SignInPage';
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./private.route";
import Cookies from "universal-cookie";


const cookies = new Cookies();

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
