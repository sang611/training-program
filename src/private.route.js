import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from './redux/actions/index';
import axios from "axios";
import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";

const cookies = new Cookies();
const PrivateRoute = ({ component: Component, children, ...rest }) => {
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  const dispatch = useDispatch();
  const checkToken = useSelector(state => state.auth);
  const {isValidToken} = checkToken;
  useEffect(() => {
    const token = cookies.get("access_token");
    const account = cookies.get("account");
    if (token) {
        axios.defaults.withCredentials = true;
        axios.post("http://localhost:9000/accounts/checkAccessToken")
        .then(() => {
            dispatch(actions.setIsValidToken(true));
            jwt.verify(token, "training_program_2019_fc9f03e8", function (err, decoded) {
                if(decoded) {
                    dispatch(actions.setCurrentUser(decoded));
                    if(decoded.role > 0) {
                        dispatch(actions.getAUser({
                            accountUuid: decoded.uuid,
                        }))
                    }
                }

            })


        })
        .catch((err) => {
          dispatch(actions.setIsValidToken(false))
        })
        .then(() => setIsTokenValidated(true));
    } else {
      setIsTokenValidated(true);
    }
  }, []);

  if (!isTokenValidated) return "";
  return !isValidToken  ? (
    <Route
      {...rest}
      render={(props) => {
          return (
            <Redirect
              to={{
                pathname: "/uet/signin",
                state: { from: props.location },
              }}
            />
          );
      }}
    />
  ) : (
        children
  )
  ;
};

export default PrivateRoute;
