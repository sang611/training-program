import React, {useState, useEffect} from "react";
import {Route, Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from './redux/actions/index';
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";
import SignInPage from "./pages/signin/SignInPage/SignInPage";

const cookies = new Cookies();
const PrivateRoute = ({component: Component, children, ...rest}) => {
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    const dispatch = useDispatch();
    const checkToken = useSelector(state => state.auth);
    const {isValidToken} = checkToken;

    const SECRET_KEY = "training_program_2019_fc9f03e8";

    useEffect(() => {
        const token = cookies.get("access_token");
        if (token) {
            axios.defaults.withCredentials = true;
            axios.post("/accounts/checkAccessToken")
                .then(() => {
                    dispatch(actions.setIsValidToken(true));
                    jwt.verify(token, SECRET_KEY, function (err, decoded) {
                        if (decoded) {
                            dispatch(actions.setCurrentUser(decoded));
                            dispatch(actions.getAUser({
                                accountUuid: decoded.uuid,
                            }))
                        }
                    })

                })
                .catch((err) => {
                    dispatch(actions.setIsValidToken(false))
                })
                .finally(() => setIsTokenValidated(true));
        } else {
            setIsTokenValidated(true);
        }
    }, []);


    if (!isTokenValidated) return "";

    return !isValidToken ? (
        <>
            <Route
                {...rest}
                render={(props) => {
                    return (
                        <>
                            <Redirect
                                to={{
                                    pathname: "/uet/signin",
                                    state: {from: props.location},
                                }}
                            />
                        </>

                    );
                }}
            />
        </>

    ) : (
        children
    )
        ;
};

export default PrivateRoute;
