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
    Tabs, Upload
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

function handleBirthday(user) {
    if (user.birthday) {
        let parts = user.birthday.split('-');
        let mydate = parts[2] + '/' + parts[1] + '/' + parts[0]
        return mydate
    }
}

const UpdateStudentProfile = ({user, userRole}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {trainingPrograms} = useSelector(state => state.trainingPrograms)
    const {majors} = useSelector(state => state.majors)

    useEffect(() => {
        dispatch(actions.getAllTrainingProgram())
        dispatch(actions.getAllMajor());
    }, [])

    useEffect(() => {
        console.log(user)
        form.setFieldsValue({
            fullname: user.fullname,
            student_code: user.student_code,
            gender: user.gender,
            address: user.address,
            email: user.email,
            phone_number: user.phone_number,
            class: user.class,
            vnu_mail: user.vnu_mail,
            majorUuid: user.major ? user.major.uuid : "",
            trainingProgramUuid: user.training_program ? user.training_program.uuid : ""
        });


    }, [])

    const onUpdateStudentInfor = (values) => {
        axios.put(`/students/${user.uuid}`, values)
            .then(res => {
                message.success(res.data.message)
                dispatch(actions.getDetailUser({
                    accountUuid: user.account.uuid
                }))
            })
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
                                    {
                                        user.birthday ?
                                            <DatePicker
                                                defaultValue={
                                                    moment(user.birthday, 'YYYY/MM/DD')
                                                }
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
                                <Form.Item label="Giới tính:" name="gender">
                                    <Radio.Group name="radio-gender" defaultValue={user.gender}>
                                        <Radio value={"Nam"}>Nam</Radio>
                                        <Radio value={"Nữ"}>Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Địa chỉ:" name="address">
                            <Input placeholder="Nhập địa chỉ"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <Form.Item label="Email cá nhân:" name="email">
                            <Input placeholder="Địa chỉ email" rules={[{type: 'email'}]} addonBefore={<MailTwoTone/>}/>
                        </Form.Item>
                        <Form.Item label="Email VNU:" name="vnu_mail">
                            <Input placeholder="Địa chỉ email vnu" rules={[{type: 'email'}]}
                                   addonBefore={<MailTwoTone/>}/>
                        </Form.Item>
                        <Form.Item label="Số điện thoại:" name="phone_number">
                            <Input placeholder="Số điện thoại" addonBefore={<PhoneTwoTone/>}/>
                        </Form.Item>

                        <Form.Item label="Ngành đào tạo:" name="majorUuid">
                            <Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder="Ngành"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    majors.map((major, index) =>
                                        <Select.Option value={major.uuid} key={index}>{major.vn_name}</Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item label="Thuộc chương trình đào tạo:" name="trainingProgramUuid">
                            <Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder="Chương trình đào tạo"
                                optionFilterProp="children"
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

const StudentInfoDescription = ({user}) => user ? (
    <Descriptions
        title={"Thông tin sinh viên"}
        column={{xs: 1, sm: 1, md: 2}}
        bordered
        className="user-info-desc"
        labelStyle={{width: '150px'}}
    >
        <Descriptions.Item label="Họ và tên">{user.fullname}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{
            handleBirthday(user)
        }</Descriptions.Item>
        <Descriptions.Item label="Mã sinh viên">{user.student_code}</Descriptions.Item>
        <Descriptions.Item label="Ngành">{user.major ? user.major.vn_name : ''}</Descriptions.Item>
        <Descriptions.Item label="Lớp">{user.class}</Descriptions.Item>
        <Descriptions.Item label="Email VNU">
            {user.vnu_mail}
        </Descriptions.Item>
        <Descriptions.Item label="Email cá nhân">
            {user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
    </Descriptions>
) : ''

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
                dispatch(actions.getAUser({
                    accountUuid: user.account.uuid
                }))
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
                                {
                                    user.birthday ?
                                        <DatePicker
                                            defaultValue={
                                                moment(user.birthday, 'YYYY/MM/DD')
                                            }
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

const LecturerInfoDescription = ({user}) => user ? (
    <Descriptions
        title={"Thông tin giảng viên"}
        column={{xs: 1, sm: 1}}
        bordered
        className="user-info-desc"
    >
        <Descriptions.Item label="Họ và tên">{user.fullname}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{
            handleBirthday(user)
        }</Descriptions.Item>
        <Descriptions.Item label="Học hàm">{user.academic_rank}</Descriptions.Item>
        <Descriptions.Item label="Học vị">{user.academic_degree}</Descriptions.Item>
        <Descriptions.Item label="Email VNU">
            {user.vnu_mail}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
            {user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
    </Descriptions>
) : ''

const DetailActivities = ({detailUser, currentUser, userRole}) => {
    let role = detailUser.account.role;
    const {uuid} = useParams();
    return (
        <>

            <Tabs defaultActiveKey="1" type="card" size={"middle"}>
                <Tabs.TabPane tab="Hồ sơ" key="1">
                    <Row>
                        <Col span={24}>
                            {
                                role == 3 ?
                                    <StudentInfoDescription user={detailUser}/> :
                                    <LecturerInfoDescription user={detailUser}/>
                            }
                        </Col>
                    </Row>
                </Tabs.TabPane>
                {
                    (userRole == 0 || currentUser.uuid == uuid) ?
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
                        : ''
                }
                {
                    (role == 1 || role == 2) ?
                        <Tabs.TabPane tab="Học phần phụ trách" key="3">
                            <EmployeeAssignCourses employee={detailUser}/>
                        </Tabs.TabPane>
                        : ''
                }

            </Tabs>
        </>
    )


    /* if (userRole == 0) {
         if (role == 1 || role == 2)
             return (
                 <Tabs defaultActiveKey="1" type="card" size={"middle"}>
                     <Tabs.TabPane tab="Hồ sơ" key="1">
                         <Row>
                             <Col span={15}>
                                 {
                                     role == 3 ?
                                         <StudentInfoDescription user={detailUser}/> :
                                         <LecturerInfoDescription user={detailUser}/>
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
                                     role == 3 ?
                                         <StudentInfoDescription user={detailUser}/> :
                                         <LecturerInfoDescription user={detailUser}/>
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
                                     role == 3 ?
                                         <StudentInfoDescription user={detailUser}/> :
                                         <LecturerInfoDescription user={detailUser}/>
                                 }
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
                                     role == 3 ?
                                         <StudentInfoDescription user={detailUser}/> :
                                         <LecturerInfoDescription user={detailUser}/>
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
     }*/
}

const DetailAccountPage = () => {
    const {uuid} = useParams();
    const {userRole, currentUser} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    const dispatch = useDispatch();
    const {loadingDetailUser, detailUser, errorDetailUser} = useSelector(state => state.accounts)
    const [isShowAvaFile, setIsShowAvaFile] = useState(true);

    useEffect(() => {

    }, [])


    const props = {
        name: 'file',
        action: user ? userRole == 3 ?
            `${axios.defaults.baseURL}/students/${user.uuid}/avatar` :
            `${axios.defaults.baseURL}/employees/${user.uuid}/avatar` : ""
        ,
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {

                dispatch(actions.getAUser({
                    accountUuid: currentUser.uuid,
                }))


                setIsShowAvaFile(false);
                message.success(`Upload ảnh đại diện thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload ảnh đại diện không thành công.`);
            }
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    useEffect(() => {
        dispatch(actions.getDetailUser({accountUuid: uuid}));

    }, [uuid])


    return loadingDetailUser == false ? (
        <>
            <div style={{
                position: 'relative',
                bottom: '-20px'
            }}>
                <Space>
                    {
                        currentUser.uuid == uuid ?
                            <Upload {...props} showUploadList={isShowAvaFile}>
                                <Avatar
                                    src={user ? user.avatar : ''}
                                    size={100}
                                    style={{cursor: 'pointer'}}
                                />
                            </Upload> :
                            <Avatar src={detailUser.avatar} size={100}/>
                    }

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
                                component={() => <i
                                    className="fas fa-birthday-cake"></i>}/>&ensp;{handleBirthday(detailUser)}
                        </Descriptions.Item>
                        <Descriptions.Item contentStyle={{color: "gray"}}>
                            <Icon component={() => <i className="fas fa-venus-mars"></i>}/>&ensp;
                            {
                                detailUser.gender
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </Col>

            </div>
            <br/><br/>
            {
                /*(userRole == 0 || currentUser.uuid == uuid) ? (
                    <Tabs defaultActiveKey="1" type="card" size={"middle"}>
                        <Tabs.TabPane tab="Hồ sơ" key="1">
                            <Row>
                                <Col span={15}>
                                    {
                                        detailUser.account.role == 3 ?
                                            <StudentInfoDescription user={detailUser} /> :
                                            <LecturerInfoDescription user={detailUser} />
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
                )*/
                <DetailActivities detailUser={detailUser} userRole={userRole} currentUser={currentUser}/>
            }

        </>

    ) : <Spin/>
}

export default DetailAccountPage;
