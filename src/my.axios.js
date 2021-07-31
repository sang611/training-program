import axios from 'axios';
import {useDispatch} from "react-redux";
import * as actions from "./redux/actions";

axios.defaults.baseURL = "http://112.137.129.236:9000"

export default axios