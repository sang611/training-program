import {
    Avatar,
    Button,
    Col,
    DatePicker,
    Descriptions,
    Divider,
    Form,
    Input, message,
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
import axios from "axios";
import UpdateLoginInfor from "./UpdateLoginInfor";
import EmployeeAssignCourses from "./EmployeeAssignCourses";
import {course} from "../../constants/Items";


const UpdateStudentProfile = ({user, userRole}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const insState = useSelector(state => state.institutions)
    const {trainingPrograms} = useSelector(state => state.trainingPrograms)

    useEffect(() => {
        dispatch(actions.getAllInstitution());
        dispatch(actions.getAllTrainingProgram())
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
        });


    }, [])

    const onUpdateStudentInfor = (values) => {
        axios.put(`/students/${user.uuid}`, values)
            .then(res => message.success(res.data.message))
            .catch(e => message.error(e.response.data.message))
    }

    return (
        <>
            <Row>
                <Col span={12}>
                    <Form
                        layout={'vertical'}
                        form={form}
                        initialValues={{
                            layout: 'vertical',
                        }}
                        onFinish={onUpdateStudentInfor}
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

                        <Form.Item label="Thuộc chương trình đào tạo:" name="trainingProgram">
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Chương trình đào tạo"
                                optionFilterProp="children"
                                defaultValue={user.training_program.uuid}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    trainingPrograms.map((ins, index) =>
                                        <Select.Option value={ins.uuid} key={index}>{ins.vn_name}</Select.Option>
                                    )
                                }
                            </Select>

                        </Form.Item>

                        <Form.Item label="Lớp môn học:" name="class">
                            <Input placeholder="Lớp môn học của sinh viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <br/>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={10} offset={2}>
                    <UpdateLoginInfor
                        user={user}
                        userRole={userRole}
                    />
                </Col>
            </Row>
        </>
    )
}

const UpdateLecturerProfile = ({user, userRole}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const insState = useSelector(state => state.institutions)
    const {courses} = useSelector(state => state.courses)
    useEffect(() => {
        dispatch(actions.getAllInstitution());
        dispatch(actions.getAllCourse());
    }, [])

    useEffect(() => {
        console.log(user)
        form.setFieldsValue({
            fullname: user.fullname,
            student_code: user.student_code,
            gender: user.gender,
            email: user.email,
            vnu_mail: user.vnu_mail,
            phone_number: user.phone_number,
            academic_rank: user.academic_rank,
            academic_degree: user.academic_degree,
            institutionUuid: user.institution ? user.institution.uuid : ''
        });

    }, [])


    const onUpdateLecturerInfor = (values) => {
        axios.put(`/employees/${user.uuid}`, values)
            .then((res) => {
                message.success(res.data.message)
            })
            .catch((err) => message.error(err.response.data.message))
    }

    return (
        <Row>
            <Col span={12}>
                <h2>Thông tin cá nhân</h2>
                <Form
                    layout={'vertical'}
                    form={form}
                    initialValues={{
                        layout: 'vertical',
                    }}
                    onFinish={onUpdateLecturerInfor}
                >
                    <Form.Item label="Tên giảng viên:" name="fullname">
                        <Input placeholder="Nhập tên giảng viên"
                               addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Ngày sinh:" name="birthday">
                                <DatePicker defaultValue={moment('01/01/2021', 'DD/MM/YYYY')}
                                            format={['DD/MM/YYYY', 'DD/MM/YY']}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Giới tính:" name="gender">
                                <Radio.Group name="radio-gender">
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
                    <Form.Item label="Học hàm:" name="academic_rank">
                        <Input placeholder="Học hàm của giảng viên"
                               addonBefore={<i className="fas fa-brain" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>
                    <Form.Item label="Học vị:" name="academic_degree">
                        <Input placeholder="Học vị của giảng viên"
                               addonBefore={<i className="fas fa-medal" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>
                    <Form.Item label="Đơn vị chuyên môn:" name="institutionUuid">
                        <Select
                            showSearch
                            style={{width: 200}}
                            placeholder="Đơn vị chuyên môn"
                            optionFilterProp="children"
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

                    <br/>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
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

const DetailAccountPage = () => {
    const {uuid} = useParams();
    const {userRole, currentUser} = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const {loadingDetailUser, detailUser, errorDetailUser} = useSelector(state => state.accounts)

    useEffect(() => {
        dispatch(actions.getDetailUser({accountUuid: uuid}));
    }, [uuid])

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

    const DetailActivities = () => {
        let role = detailUser.account.role;
        if (userRole == 0) {
            if (role == 1 || role == 2)
                return (
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
                                role == 3 ?
                                    <UpdateStudentProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    /> :
                                    <UpdateLecturerProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    />
                            }
                        </Tabs.TabPane>
                        {
                            userRole == 1 ?
                                <Tabs.TabPane tab="Học phần phụ trách" key="3">
                                    <EmployeeAssignCourses/>
                                </Tabs.TabPane> : ''
                        }
                    </Tabs>
                )
            else
                return (
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
                                role == 3 ?
                                    <UpdateStudentProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    /> :
                                    <UpdateLecturerProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    />
                            }
                        </Tabs.TabPane>
                    </Tabs>
                )
        }

        if (currentUser.uuid == uuid) {
            if (userRole == 2 || userRole == 1) {
                return (
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
                                role == 3 ?
                                    <UpdateStudentProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    /> :
                                    <UpdateLecturerProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    />
                            }
                        </Tabs.TabPane>
                        {
                            userRole == 1 ?
                                <Tabs.TabPane tab="Học phần phụ trách" key="3">
                                    <EmployeeAssignCourses/>
                                </Tabs.TabPane> : ''
                        }
                        <Tabs.TabPane tab="Học phần phụ trách" key="3">
                            <EmployeeAssignCourses/>
                        </Tabs.TabPane>
                    </Tabs>

                )
            } else {
                return (
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
                                role == 3 ?
                                    <UpdateStudentProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    /> :
                                    <UpdateLecturerProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    />
                            }
                        </Tabs.TabPane>

                    </Tabs>
                )
            }
        }
    }


    return loadingDetailUser == false ? (
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
                                detailUser.account.role == 3 ?
                                    "Sinh viên trường Đại học Công nghệ"
                                    : (
                                        (detailUser.account.role == 1 || detailUser.account.role == 2) ?
                                            "Giảng viên trường đại học công nghệ" : ""
                                    )
                            }
                        </Descriptions.Item>
                        <Descriptions.Item contentStyle={{color: "gray"}}>
                            <MailOutlined/>&ensp;{detailUser.email}
                        </Descriptions.Item>
                        <Descriptions.Item contentStyle={{color: "gray"}}>
                            <Icon
                                component={() => <i className="fas fa-birthday-cake"></i>}/>&ensp;{detailUser.birthday}
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
                (userRole == 0 || currentUser.uuid == uuid) ? (
                    <Tabs defaultActiveKey="1" type="card" size={"middle"}>
                        <Tabs.TabPane tab="Hồ sơ" key="1">
                            <Row>
                                <Col span={15}>
                                    {
                                        detailUser.account.role == 3 ? StudentInfoDescription(detailUser) : LecturerInfoDescription(detailUser)
                                    }
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Chỉnh sửa hồ sơ" key="2">
                            {
                                detailUser.account.role == 3 ?
                                    <UpdateStudentProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    /> :
                                    <UpdateLecturerProfile
                                        user={detailUser}
                                        userRole={userRole}
                                    />
                            }
                        </Tabs.TabPane>
                        {
                            (userRole == 0 && (detailUser.account.role == 1 || detailUser.account.role == 2)) ||
                            (currentUser.uuid == uuid && (detailUser.account.role == 1 || detailUser.account.role == 2))
                                ?
                                <Tabs.TabPane tab="Học phần phụ trách" key="3">
                                    <EmployeeAssignCourses employee={detailUser}/>
                                </Tabs.TabPane> : ''
                        }
                    </Tabs>
                ) : (
                    <Row>
                        <Col span={15}>
                            {
                                detailUser.account.role == 3 ? StudentInfoDescription(detailUser) : LecturerInfoDescription(detailUser)
                            }
                        </Col>
                    </Row>
                )
            }

        </>

    ) : <Spin/>
}

export default DetailAccountPage;
