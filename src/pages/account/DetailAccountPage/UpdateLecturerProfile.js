import {Button, Card, Cascader, Col, DatePicker, Form, Input, message, Radio, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import * as actions from "../../../redux/actions";
import moment from "moment";
import axios from "axios";
import Title from "antd/lib/typography/Title";
import {MailTwoTone, PhoneTwoTone} from "@ant-design/icons";
import UpdateLoginInfor from "./UpdateLoginInfor";

const UpdateLecturerProfile = ({user, userRole}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {listInstitutions, loading} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);
    const {uuid} = useParams();

    useEffect(() => {
        dispatch(actions.getAllInstitution());
    }, [])

    useEffect(() => {
        handleInstitutionData(listInstitutions)
        setInstitutions(listInstitutions)
    }, [listInstitutions])

    function handleInstitutionData(institutions) {

        for (let ins of institutions) {
            ins.value = ins.uuid;
            ins.label = ins.vn_name;
            if (ins.children && ins.children.length > 0) {
                handleInstitutionData(ins.children)
            }
        }
    }

    useEffect(() => {
        let parentInstitution = user.institution ? listInstitutions.find(ins => ins.uuid === user.institution.parent_uuid) : ''

        form.setFieldsValue({
            fullname: user.fullname,
            student_code: user.student_code,
            gender: user.gender,
            birthday: moment(user.birthday || '2021-01-01', 'YYYY/MM/DD'),
            email: user.email,
            vnu_mail: user.vnu_mail,
            phone_number: user.phone_number,
            academic_rank: user.academic_rank,
            academic_degree: user.academic_degree,
            institutionUuid: parentInstitution ? [parentInstitution.uuid, user.institution.uuid] : [user.institution.uuid],
            note: user.note
        });
    }, [listInstitutions])


    const onUpdateLecturerInfor = (values) => {

        axios.put(`/employees/${user.uuid}`, {
            ...values,
            institutionUuid:
                values.institutionUuid.length === 2
                    ? values.institutionUuid[1]
                    : values.institutionUuid[0]
        })
            .then((res) => {
                message.success(res.data.message)
                dispatch(actions.getDetailUser({accountUuid: uuid}));
            })
            .catch((err) => message.error(err.response.data.message))
    }

    return userRole < user.account.role ? (
        <Row>
            <Col span={12}>
                <Card title={<Title level={4}>Thông tin cá nhân</Title>}>
                    <Form
                        layout={'vertical'}
                        form={form}
                        initialValues={{
                            layout: 'vertical',
                        }}
                        onFinish={onUpdateLecturerInfor}
                    >
                        <Form.Item
                            label="Tên giảng viên:"
                            name="fullname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Họ tên không được để trống!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên giảng viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Ngày sinh:" name="birthday">
                                    {
                                        user.birthday ?
                                            <DatePicker
                                                format={['DD/MM/YYYY', 'DD/MM/YY']}/>
                                            :
                                            <DatePicker
                                                placeholder="Chọn ngày sinh"
                                                format={['DD/MM/YYYY', 'DD/MM/YY']}
                                            />
                                    }
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Giới tính:"
                                    name="gender"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn một giới tính!',
                                        },
                                    ]}
                                >
                                    <Radio.Group name="radio-gender">
                                        <Radio value={"Nam"}>Nam</Radio>
                                        <Radio value={"Nữ"}>Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Email cá nhân:"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'email không đúng định dạng!'
                                },
                            ]}
                        >
                            <Input placeholder="Địa chỉ email" addonBefore={<MailTwoTone/>}/>
                        </Form.Item>
                        <Form.Item
                            label="Email VNU"
                            name="vnu_mail"
                            rules={[
                                {
                                    required: true,
                                    message: 'VNU mail không được để trống!',
                                },
                                {
                                    type: 'email',
                                    message: 'VNU mail không đúng định dạng!'
                                },
                            ]}
                        >
                            <Input addonBefore={<i className="far fa-envelope"/>}/>
                        </Form.Item>
                        <Form.Item label="Số điện thoại:" name="phone_number">
                            <Input placeholder="Số điện thoại" addonBefore={<PhoneTwoTone/>}/>
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Học hàm:" name="academic_rank">
                                    <Input placeholder="Học hàm của giảng viên"
                                           addonBefore={<i className="fas fa-brain" style={{color: '#1890FF'}}/>}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Học vị:" name="academic_degree">
                                    <Input placeholder="Học vị của giảng viên"
                                           addonBefore={<i className="fas fa-medal" style={{color: '#1890FF'}}/>}/>
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item label="Đơn vị chuyên môn:" name="institutionUuid">

                            <Cascader
                                style={{width: '100%'}}
                                options={
                                    institutions.filter((ins) => !ins.parent_uuid)
                                }
                                placeholder="Chọn đơn vị chuyên môn"
                                changeOnSelect
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn 1 đơn vị chuyên môn!',
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ghi chú, chức vụ:"
                            name="note"
                        >
                            <Input
                                placeholder="Chức vụ, ghi chú"
                                addonBefore={<i className="fas fa-quote-right"
                                                style={{color: '#1890FF'}}/>}
                            />
                        </Form.Item>

                        <br/>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Form.Item>
                    </Form>
                </Card>

            </Col>
            <Col span={10} offset={2}>
                <UpdateLoginInfor
                    user={user}
                    userRole={userRole}
                />

            </Col>
        </Row>
    ) : (
        <Row>
            <Col span={12}>
                <Card title={<Title level={4}>Thông tin cá nhân</Title>}>
                    <Form
                        layout={'vertical'}
                        form={form}
                        initialValues={{
                            layout: 'vertical',
                        }}
                        onFinish={onUpdateLecturerInfor}
                    >
                        <Form.Item
                            label="Tên giảng viên:"
                            name="fullname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Họ tên không được để trống!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên giảng viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <Form.Item
                            label="Email cá nhân:"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'email không đúng định dạng!'
                                },
                            ]}
                        >
                            <Input placeholder="Địa chỉ email" addonBefore={<MailTwoTone/>}/>
                        </Form.Item>

                        <Form.Item label="Số điện thoại:" name="phone_number">
                            <Input placeholder="Số điện thoại" addonBefore={<PhoneTwoTone/>}/>
                        </Form.Item>

                        <br/>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Form.Item>
                    </Form>
                </Card>

            </Col>
            <Col span={10} offset={2}>
                <UpdateLoginInfor
                    user={user}
                    userRole={userRole}
                />

            </Col>
        </Row>
    )
}

export default UpdateLecturerProfile;