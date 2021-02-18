import {Menu} from "antd";
import {Header} from "antd/lib/layout/layout";
import './header.css';
import * as actions from '../../redux/actions/index'
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";

export default function () {

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth)
    const signOut = () => {
        dispatch(actions.authLogout());
    }

    return state.isValidToken ? (
        <Header className="header">
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{marginLeft: 'auto'}}>
                <Menu.Item key="1" onClick={signOut}>Đăng xuất</Menu.Item>
            </Menu>
        </Header>
    ) : <Redirect to="uet/signin" />
}