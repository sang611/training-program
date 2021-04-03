import React, {useState, useEffect} from 'react';
import {Button, Checkbox, Col, Divider, Form, Image, Input, message, Modal, notification, Row} from "antd";
import './SignInPage.css'
import Title from "antd/lib/typography/Title";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import * as actions from '../../redux/actions/index'
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import Cookies from "universal-cookie";


const ForgotPasswordForm = ({ visible, onCreate, onCancel }) => {
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
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

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

    const onFinish = (values) => {
        setSignInfo(values);
        dispatch(actions.auth(values));
    };


    useEffect(() => {
        localStorage.removeItem("menu-active")
    }, [])

    useEffect(() =>{
        if(state.error) {

        notification.error({
            message: 'Đăng nhập không thành công',
            description:
                'Email hoặc mật khẩu không đúng',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    } else if(state.user) {
            notification.success({
                message: 'Đăng nhập thành công',
                description:
                    'Hệ thống quản lý Chương trình đào tạo',
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



    return state.isValidToken ? <Redirect to="/uet/training-programs" /> : (

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
                                    <Input.Password
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

                                    <a className="login-form-forgot" onClick={() => {
                                        setVisible(true);
                                    }}>
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
