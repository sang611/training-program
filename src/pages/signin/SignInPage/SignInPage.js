import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Divider, Form, Input, message, Modal, notification, Switch} from "antd";
import './SignInPage.css'
import Title from "antd/lib/typography/Title";
import {LockOutlined, LoginOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import * as actions from '../../../redux/actions'
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import jwt from "jsonwebtoken";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ForgotPasswordForm = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title="Quên mật khẩu?"
            okText="Gửi"
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Nhập email đã đăng ký để nhận lại mật khẩu!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

function SignInPage(props) {

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth);
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    useEffect(() => {
        const token = cookies.get("access_token");
        if (token) {
            axios.defaults.withCredentials = true;
            axios.post("/accounts/checkAccessToken")
                .then(() => {
                    dispatch(actions.setIsValidToken(true));
                    jwt.verify(token, "training_program_2019_fc9f03e8", function (err, decoded) {
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

    const onFinish = (values) => {
        dispatch(actions.auth(values));
    };

    useEffect(() => {
        localStorage.removeItem("menu-active")
    }, [])


    useEffect(() => {
        if (state.error) {
            notification.error({
                message: 'Đăng nhập không thành công',
                description: 'Email hoặc mật khẩu không đúng'
            });
        } else if (state.user) {
            notification.success({
                message: 'Đăng nhập thành công',
                description: 'Hệ thống quản lý Chương trình đào tạo',
                placement: 'bottomRight'
            });
        }
    }, [state.error, state.user])

    const [visible, setVisible] = useState(false);

    const onCreate = (values) => {
        console.log('Received values of form: ', values);
        axios.post("accounts/password/reset", {email: values.email})
            .then((res) => {
                message.success(`Kiểm tra email ${values.email} để lấy lại mật khẩu mới!`)
            })
            .catch(e => message.error(e.response.data.message))
        setVisible(false);
    };

    if (!isTokenValidated) return "";
    return state.isValidToken ? <Redirect to={state.userRole < 2 ? '/uet/statistic' : '/uet/training-programs'}/> : (

        <div className="login-container">
            <div className="login-card">
                <div id="signin-image">
                </div>
                <div id="siginin-form-wrapper">
                    <div id="signin-form">
                        <Divider style={{marginTop: 0, marginBottom: 25}}>
                            <Title level={2}>Đăng nhập hệ thống</Title>
                        </Divider>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                uetLogin: true,
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
                                       placeholder="Tên đăng nhập"
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
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Mật khẩu"
                                    size="large"
                                    className="login-form-input"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="uetLogin" valuePropName="checked" noStyle>
                                    {/*<Checkbox>Sử dụng tài khoản UET</Checkbox>*/}
                                    <Switch
                                        defaultChecked
                                        checkedChildren="Tài khoản VNU"
                                        unCheckedChildren="Tài khoản hệ thống"
                                    />
                                </Form.Item>

                                <a className="login-form-forgot" onClick={() => {
                                    setVisible(true);
                                }}>
                                    Quên mật khẩu
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    shape="round"
                                    className="login-form-button"
                                    loading={state.loading}
                                    icon={<LoginOutlined />}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>

            </div>
            <ForgotPasswordForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    )
}

export default SignInPage;
