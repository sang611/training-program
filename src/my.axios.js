import axios from 'axios';
import {useDispatch} from "react-redux";
import * as actions from "./redux/actions";

axios.defaults.baseURL = "http://localhost:9000"

export default axios