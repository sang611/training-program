import {
    Avatar,
    Button,
    Col,
    DatePicker,
    Descriptions,
    Divider,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Tabs
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom";
import * as actions from '../../redux/actions'
import Title from "antd/lib/typography/Title";
import Icon, {DesktopOutlined, MailOutlined, MailTwoTone, PhoneOutlined, PhoneTwoTone} from "@ant-design/icons";
import './DetailAccountPage.css'
import moment from "moment";
import Cookies from "universal-cookie/lib";



const UpdateStudentProfile = ({user}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const insState = useSelector(state => state.institutions)
    useEffect(() => {
        dispatch(actions.getAllInstitution());
    }, [])

    useEffect(() => {
        console.log(user)
        form.setFieldsValue({
            fullname: user.fullname,
            student_code: user.student_code,
            gender: user.gender,
            email: user.email,
            phone_number: user.phone_number,
            class: user.class,
            vnu_mail: user.vnu_mail

        })
    }, [])


    return (
        <>
            <Row>
                <Col span={12} offset={1}>
                    <Form
                        layout={'vertical'}
                        form={form}
                        initialValues={{
                            layout: 'vertical',
                        }}

                    >
                        <Form.Item label="Họ tên sinh viên:" name="fullname">
                            <Input placeholder="Nhập tên sinh viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Form.Item label="Mã sinh viên:" name="student_code">
                            <Input placeholder="Nhập mã sinh viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Ngày sinh:" name="birthday">
                                    <DatePicker
                                        defaultValue={moment('01/01/2021', 'DD/MM/YYYY')}
                                        format={['DD/MM/YYYY', 'DD/MM/YY']}
                                        onChange={(val) => console.log(val)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Giới tính:" name="gender">
                                    <Radio.Group name="radio-gender" defaultValue={user.gender}>
                                        <Radio value={0}>Nam</Radio>
                                        <Radio value={1}>Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Email cá nhân:" name="email">
                            <Input placeholder="Địa chỉ email" rules={[{type: 'email'}]} addonBefore={<MailTwoTone/>}/>
                        </Form.Item>
                        <Form.Item label="Số điện thoại:" name="phone_number">
                            <Input placeholder="Số điện thoại" addonBefore={<PhoneTwoTone/>}/>
                        </Form.Item>
                        <Form.Item label="Đơn vị chuyên môn:" name="institution">
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Đơn vị chuyên môn"
                                optionFilterProp="children"
                                defaultValue={user.institution.uuid}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    insState.listInstitutions.map((ins, index) =>
                                        <Select.Option value={ins.uuid} key={index}>{ins.vn_name}</Select.Option>
                                    )
                                }
                            </Select>

                        </Form.Item>
                        <Form.Item label="Lớp môn học:" name="class">
                            <Input placeholder="Lớp môn học của sinh viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Form.Item
                            label="Email VNU"
                            name="vnu_mail"
                            rules={[
                                {
                                    required: true,
                                    message: 'VNU mail không được để trống!',
                                },
                            ]}
                        >
                            <Input suffix={<i className="far fa-envelope"/>}/>
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mật khẩu không được để trống!',
                                },
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <br/>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

const DetailAccountPage = () => {
    const {uuid, role} = useParams();
    const {userRole} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const {loadingDetailUser, detailUser, errorDetailUser} = useSelector(state => state.accounts)

    useEffect(() => {
        dispatch(actions.getDetailUser({accountUuid: uuid, role: role}));

    }, [])

    const StudentInfoDescription = (user) => (
        <Descriptions
            title={"Thông tin sinh viên"}
            column={{xs: 1, sm: 1, md: 1}}
            bordered
            className="user-info-desc"
        >
            <Descriptions.Item label="Họ và tên">{user.fullname}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{user.birthday}</Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{user.student_code}</Descriptions.Item>
            <Descriptions.Item label="Lớp">{user.class}</Descriptions.Item>
            <Descriptions.Item label="Email">
                {user.vnu_mail}
                <br/>
                {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
        </Descriptions>
    )
    const LecturerInfoDescription = (user) => (
        <Descriptions
            title={"Thông tin giảng viên"}
            column={{xs: 1, sm: 1, md: 1}}
            bordered
            className="user-info-desc"
        >
            <Descriptions.Item label="Họ và tên">{user.fullname}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{user.birthday}</Descriptions.Item>
            <Descriptions.Item label="Học hàm">{user.academic_rank}</Descriptions.Item>
            <Descriptions.Item label="Học vị">{user.academic_degree}</Descriptions.Item>
            <Descriptions.Item label="Email">
                {user.vnu_mail}
                <br/>
                {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
        </Descriptions>
    )


    return loadingDetailUser ? <Spin/> : (
        detailUser ? (
            <>
                <div style={{
                    position: 'relative',
                    bottom: '-20px'
                }}>
                    <Space>
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" size={100}/>
                        <Title level={4}>
                            {detailUser.fullname}
                        </Title>
                    </Space>
                </div>
                <div style={{
                    padding: "20px",
                    backgroundColor: "#F1F1F1"
                }}>
                    <Col offset={4} span={20}>
                        <Descriptions column={{xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1}}>
                            <Descriptions.Item contentStyle={{color: "gray"}}>
                                <Icon component={() => <i className="fas fa-briefcase"></i>}/>&ensp;
                                {
                                    role == 3 ? "Sinh viên trường Đại học Công nghệ" : (
                                        role == 1 ? "Giảng viên trường đại học công nghệ" : ""
                                    )
                                }
                            </Descriptions.Item>
                            <Descriptions.Item contentStyle={{color: "gray"}}>
                                <MailOutlined/>&ensp;{detailUser.email}
                            </Descriptions.Item>
                            <Descriptions.Item contentStyle={{color: "gray"}}>
                                <Icon component={() => <i className="fas fa-birthday-cake"></i>}/>&ensp;{detailUser.birthday}
                            </Descriptions.Item>
                            <Descriptions.Item contentStyle={{color: "gray"}}>
                                <Icon component={() => <i className="fas fa-venus-mars"></i>}/>&ensp;
                                {
                                    detailUser.gender == 1 ? "Nữ" : "Nam"
                                }
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>

                </div>
                <br/><br/>
                {
                    userRole == 0 ? (
                        <Tabs defaultActiveKey="1" type="card" size={"middle"}>
                            <Tabs.TabPane tab="Hồ sơ" key="1">
                                <Row>
                                    <Col span={15}>
                                        {
                                            role == 3 ? StudentInfoDescription(detailUser) : LecturerInfoDescription(detailUser)
                                        }
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Chỉnh sửa hồ sơ" key="2">
                                {
                                    role == 3 ? <UpdateStudentProfile user={detailUser}/> : ""
                                }
                            </Tabs.TabPane>
                        </Tabs>
                    ) : (
                        <Row>
                            <Col span={15}>
                                {
                                    role == 3 ? StudentInfoDescription(detailUser) : LecturerInfoDescription(detailUser)
                                }
                            </Col>
                        </Row>
                    )
                }

            </>
        ) : "abc"
    )
}

export default DetailAccountPage;
