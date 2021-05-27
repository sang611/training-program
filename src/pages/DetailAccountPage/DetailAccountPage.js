import {
    Avatar,
    Button, Card, Cascader,
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
import React, {useState, useEffect, useMemo} from "react"
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
    const {uuid} = useParams();
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
            grade: user.grade,
            vnu_mail: user.vnu_mail,
            majorUuid: user.major ? user.major.uuid : "",
            trainingProgramUuid: user.training_program ? user.training_program.uuid : ""
        });


    }, [])

    const onUpdateStudentInfor = (values) => {
        axios.put(`/students/${user.uuid}`, values)
            .then(res => {
                message.success(res.data.message)

                dispatch(actions.getDetailUser({accountUuid: uuid}));

            })
            .catch(e => message.error(e.response.data.message))
    }

    return (
        <>
            <Row>
                <Col span={12}>
                    <Card
                        title={<Title level={4}>Thông tin cá nhân</Title>}
                        hoverable
                    >
                        <Form
                            layout={'vertical'}
                            form={form}
                            initialValues={{
                                layout: 'vertical',
                            }}
                            onFinish={onUpdateStudentInfor}
                        >
                            <Form.Item
                                label="Họ tên sinh viên:"
                                name="fullname"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tên sinh viên không được để trống'
                                    },
                                ]}
                            >
                                <Input placeholder="Nhập tên sinh viên"
                                       addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                            </Form.Item>
                            <Form.Item
                                label="Mã sinh viên:"
                                name="student_code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mã sinh viên không được để trống'
                                    },
                                ]}
                            >
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
                                <Input placeholder="Địa chỉ email" rules={[{type: 'email'}]}
                                       addonBefore={<MailTwoTone/>}/>
                            </Form.Item>
                            <Form.Item label="Email VNU:" name="vnu_mail">
                                <Input placeholder="Địa chỉ email vnu" rules={[{type: 'email'}]}
                                       addonBefore={<MailTwoTone/>}/>
                            </Form.Item>
                            <Form.Item label="Số điện thoại:" name="phone_number">
                                <Input placeholder="Số điện thoại" addonBefore={<PhoneTwoTone/>}/>
                            </Form.Item>


                            <Form.Item
                                label="Ngành đào tạo:"
                                name="majorUuid"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn ngành đào tạo của sinh viên'
                                    },
                                ]}
                            >

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
                                            <Select.Option value={major.uuid}
                                                           key={index}>{major.vn_name}</Select.Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Thuộc chương trình đào tạo:"
                                name="trainingProgramUuid"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn 1 chương trình đào tạo sinh viên theo học'
                                    },
                                ]}
                            >
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
                                        trainingPrograms.map((trains, index) =>
                                            <Select.Option value={trains.uuid}
                                                           key={index}>{trains.vn_name}</Select.Option>
                                        )
                                    }
                                </Select>

                            </Form.Item>

                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="Lớp môn học:"
                                        name="class"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Lớp môn học của sinh viên không được để trống'
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Lớp môn học của sinh viên"
                                               addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Khóa:"
                                        name="grade"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Sinh viên thuộc khóa nào?'
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="K60, K61, K62,..."
                                            addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                </Col>
                            </Row>


                            <br/>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Lưu</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={11} offset={1}>
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
        <Descriptions.Item label="Khoa">
            {
                user.training_program.institution
                    ? user.training_program.institution.vn_name
                    : ''
            }
        </Descriptions.Item>
        <Descriptions.Item label="Ngành">
            {
                user.major
                    ? user.major.vn_name
                    : ''
            }
        </Descriptions.Item>
        <Descriptions.Item label="Lớp">{`${user.grade} - ${user.class}`}</Descriptions.Item>
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

    return (
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

                        <Form.Item label="Email cá nhân:" name="email">
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
    )
}

const LecturerInfoDescription = ({user}) => user ? (
    <Descriptions
        title={"Thông tin giảng viên"}
        column={{xs: 1, sm: 1, md: 2}}
        bordered
        className="user-info-desc"
    >
        <Descriptions.Item label="Họ và tên">{user.fullname}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{
            handleBirthday(user)
        }</Descriptions.Item>
        <Descriptions.Item label="Học hàm">{user.academic_rank}</Descriptions.Item>
        <Descriptions.Item label="Học vị">{user.academic_degree}</Descriptions.Item>
        <Descriptions.Item
            label="Đơn vị chuyên môn">{user.institution ? user.institution.vn_name : ''}</Descriptions.Item>
        <Descriptions.Item label="Email VNU">
            {user.vnu_mail}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
            {user.email}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user.phone_number}</Descriptions.Item>
    </Descriptions>
) : ''

const UpdateAdminProfile = ({user, userRole}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const insState = useSelector(state => state.institutions)
    const {uuid} = useParams();

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
                dispatch(actions.getDetailUser({accountUuid: uuid}));
            })
            .catch((err) => message.error(err.response.data.message))
    }

    return (
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
                        <Form.Item label="Họ tên:" name="fullname">
                            <Input placeholder="Nhập họ tên"
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
                                        <Radio value={"Nam"}>Nam</Radio>
                                        <Radio value={"Nữ"}>Nữ</Radio>
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

const AdminInfoDescription = ({user}) => user ? (
    <Descriptions
        title={"Thông tin admin"}
        column={{xs: 1, sm: 1}}
        bordered
        className="user-info-desc"
    >
        <Descriptions.Item label="Họ và tên">{user.fullname}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{
            handleBirthday(user)
        }</Descriptions.Item>
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
                                function () {
                                    if (role == 3) {
                                        return <StudentInfoDescription user={detailUser}/>
                                    }
                                    if (role == 1 || role == 2) {
                                        return <LecturerInfoDescription user={detailUser}/>
                                    }
                                    if (role == 0) {
                                        return <AdminInfoDescription user={detailUser}/>
                                    }
                                }()

                            }
                        </Col>
                    </Row>
                </Tabs.TabPane>
                {
                    (userRole == 0 || currentUser.uuid == uuid) ?
                        <Tabs.TabPane tab="Chỉnh sửa hồ sơ" key="2">
                            {
                                function () {
                                    if (role == 3) {
                                        return <UpdateStudentProfile
                                            user={detailUser}
                                            userRole={userRole}
                                        />
                                    }
                                    if (role == 1 || role == 2) {
                                        return <UpdateLecturerProfile
                                            user={detailUser}
                                            userRole={userRole}
                                        />
                                    }
                                    if (role == 0) {
                                        return <UpdateAdminProfile
                                            user={detailUser}
                                            userRole={userRole}
                                        />
                                    }
                                }()
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

}


const DetailAccountPage = () => {
    const {uuid} = useParams();
    const {userRole, currentUser} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    const dispatch = useDispatch();
    const {loadingDetailUser, detailUser} = useSelector(state => state.accounts)
    const [isShowAvaFile, setIsShowAvaFile] = useState(true);


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


    return loadingDetailUser == false && detailUser ? (
        <>
            <div style={{
                position: 'relative',
                bottom: '-20px'
            }}>
                <Space>
                    {
                        currentUser.uuid == uuid ?
                            <Upload {...props} showUploadList={isShowAvaFile}>
                                <Avatar src={
                                    function () {
                                        if (user) {
                                            if (user.avatar) {
                                                return user.avatar.includes(':') ? user.avatar : `data:image/jpeg;base64, ${user.avatar}`
                                            } else {
                                                if (user.gender === "Nam")
                                                    return "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                                                else
                                                    return "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                                            }
                                        } else return ''
                                    }()
                                }
                                        size={100}
                                        style={{cursor: 'pointer'}}
                                />

                            </Upload> :
                            <Avatar
                                src={
                                    function () {
                                        if (detailUser) {
                                            if (detailUser.avatar) {
                                                return detailUser.avatar.includes(':') ? detailUser.avatar : `data:image/jpeg;base64, ${detailUser.avatar}`
                                            } else {
                                                if (detailUser.gender === "Nam")
                                                    return "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                                                else
                                                    return "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                                            }
                                        } else return ''
                                    }()
                                }
                                size={100}
                            />
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
                            <MailOutlined/>&ensp;{detailUser.vnu_mail}
                        </Descriptions.Item>
                        <Descriptions.Item contentStyle={{color: "gray"}}>
                            <Icon component={() => <i className="fas fa-birthday-cake"/>}/>&ensp;
                            {handleBirthday(detailUser)}
                        </Descriptions.Item>
                        <Descriptions.Item contentStyle={{color: "gray"}}>
                            <Icon component={() => <i className="fas fa-venus-mars"/>}/>&ensp;
                            {
                                detailUser.gender
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </Col>

            </div>
            <br/><br/>
            {/*{
                (userRole == 0 || currentUser.uuid == uuid) ? (
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
                )


            }*/}
            <DetailActivities detailUser={detailUser} userRole={userRole} currentUser={currentUser} uuid={uuid}/>
        </>

    ) : <Spin/>
}

export default DetailAccountPage;
