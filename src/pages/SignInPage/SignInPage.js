import React, {useState, useEffect} from 'react';
import {Button, Checkbox, Col, Divider, Form, Image, Input, Row} from "antd";
import './SignInPage.css'
import Title from "antd/lib/typography/Title";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import * as actions from '../../redux/actions/index'
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function SignInPage(props) {
    const [signInfor, setSignInfo] = useState({});
    const dispatch = useDispatch();
    const state = useSelector(state => state.auth);
    const [isAuth, setIsAuth] = useState(false);

    /*useEffect(() => {
        if(state.isValidToken) {
            cookies.set("isAuth", true)
        }
        else {
            cookies.set("isAuth", false)
        }
        setIsAuth(cookies.get("isAuth"))
    }, [state])*/

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };
    const onFinish = (values) => {

        setSignInfo(values);
        dispatch(actions.auth(values));
    };


    useEffect(() => {
        localStorage.removeItem("menu-active")
    }, [])

    return state.isValidToken ? <Redirect to="/" /> : (

        <div className="login-container">
            <Row>
                <Col span={14}>
                    <img
                        src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                        alt="No Image"
                        id="signin-image"
                    />

                </Col>
                <Col span={10}>
                    <div id="siginin-form-wrapper">

                        <div id="signin-form" >
                            <Divider style={{marginTop: 0, marginBottom: 25}}>
                                <Title level={2}>Đăng nhập hệ thống</Title>
                            </Divider>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Email không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                                           placeholder="Email"
                                           size="large"
                                           className="login-form-input"
                                    />
                                </Form.Item><br/>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mật khẩu không được để trống!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon"/>}
                                        type="password"
                                        placeholder="Mật khẩu"
                                        size="large"
                                        className="login-form-input"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Form.Item name="rememberPassword" valuePropName="checked" noStyle>
                                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                    </Form.Item>

                                    <a className="login-form-forgot" href="">
                                        Quên mật khẩu
                                    </a>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default SignInPage;
