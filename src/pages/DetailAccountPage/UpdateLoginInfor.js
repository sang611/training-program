import {Button, Card, Col, Form, Input, message} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Title from "antd/lib/typography/Title";

const UpdateLoginInfor = ({user, userRole}) => {
    const [loginUpdateForm] = Form.useForm();
    const [passwordOnlyUpdateForm] = Form.useForm();

    const [validateRePassword, setValidateRePassword] =  useState('');
    const [warningRePassword, setWarningRePassword] = useState('')


    useEffect(() => {
        loginUpdateForm.setFieldsValue({
            username: user.vnu_mail
        })
    }, [])

    const onUpdateLoginInformation = (values) => {
        axios.put(`accounts/loginInformation/${user.accountUuid}`,
            {
                newUsername: values.username,
                newPassword: values.password
            })
            .then(res => {
                loginUpdateForm.resetFields();
                message.success(res.data.message);
            })
            .catch(error => message.error(error.response.data.message))
    }



    const UpdateUsernamePasswordForm = (
        <Form
            {...{
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            }}
            name="basic"
            initialValues={{ remember: true }}
            form={loginUpdateForm}
            onFinish={onUpdateLoginInformation}
        >
            <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[{ required: true, message: 'Tên đăng nhập không được để trống!' }]}
            >
                <Input disabled/>
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...{
                    wrapperCol: { offset: 8, span: 16 }
                }}
            >
                <Button type="primary" htmlType="submit">
                    Lưu
                </Button>
            </Form.Item>
        </Form>
    )

    const onUpdatePassword = ({old_password, re_new_password, new_password}) => {
        if(re_new_password !== new_password) {
            setValidateRePassword('error');
            setWarningRePassword('Xác nhận mật khẩu mới không thành công!')
        }
        else {
            axios.put(`accounts/${user.accountUuid}/new-password`, {
                oldPassword: old_password,
                newPassword: new_password
            })
                .then((res) => {
                    passwordOnlyUpdateForm.resetFields();
                    message.success(res.data.message);
                })
                .catch((error) => {
                    message.error(error.response.data.message)
                })
        }
    }

    const UpdateOnlyPassword = (
        <Form
            {...{
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            }}
            name="basic"
            initialValues={{ remember: true }}
            form={passwordOnlyUpdateForm}
            onFinish={onUpdatePassword}
            onFieldsChange={() => {
                setWarningRePassword('');
                setValidateRePassword('');
            }}
        >

            <Form.Item
                label="Mật khẩu cũ"
                name="old_password"
                rules={[{ required: true, message: 'Mật khẩu cũ không được để trống!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Mật khẩu mới"
                name="new_password"
                rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Xác nhận mật khẩu mới"
                name="re_new_password"
                rules={[{ required: true, message: 'Nhập lại mật khẩu mới!' }]}
                validateStatus={validateRePassword}
                help={warningRePassword}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...{
                    wrapperCol: { offset: 8, span: 16 }
                }}
            >
                <Button type="primary" htmlType="submit">
                    Lưu
                </Button>
            </Form.Item>
        </Form>
    )

    return (
        <>

            <Card
                title={<Title level={4} style={{color: '#fff'}}>Thông tin đăng nhập</Title>}
                headStyle={{backgroundColor: '#306C93', }}
                bodyStyle={{backgroundColor: '#eaf0f4'}}
            >
                {
                    userRole == 0 ? UpdateUsernamePasswordForm : UpdateOnlyPassword
                }
            </Card>


        </>
    )
}

export default UpdateLoginInfor;