import {Redirect} from "react-router-dom";
import {Button, Col, DatePicker, Form, Input, message, Radio, Row, Select, Tabs} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import {AndroidOutlined, AppleOutlined, InboxOutlined, MailFilled, MailTwoTone, PhoneTwoTone} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import * as actions from '../../redux/actions'
import {Option} from "antd/lib/mentions";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import axios from "axios";
import moment from 'moment';


const CreateAccountPage = () => {
    const {isValidToken} = useSelector(state => state.auth)
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('vertical');
    const [xslxFile, setXslxFile] = useState(null);
    const [isSendingForm, setIsSendinggForm] = useState(false);
    const [typeAccount, setTypeAccount] = useState(1);
    const dispatch = useDispatch();
    const accState = useSelector(state => state.accounts)
    const insState = useSelector(state => state.institutions)
    const {trainingPrograms} = useSelector(state => state.trainingPrograms)

    useEffect(() => {
        dispatch(actions.getAllInstitution());
        dispatch(actions.getAllTrainingProgram());
    }, [])

    useEffect(() => {
        if (accState.error) {
            message.error("Đã có lỗi xảy ra")
        } else if (accState.error === false) {
            typeAccount == 1 ? message.success("Tạo mới giảng viên thành công") : message.success("Tạo mới sinh viên thành công")
        }
    }, [accState])

    const onCreateAccount = async (values) => {
        await dispatch(actions.addAccount({values, typeAccount}));
        form.resetFields();
    };

    const formItemLayout =
        formLayout === 'horizontal'
            ? {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 14,
                },
            }
            : null;
    const buttonItemLayout =
        formLayout === 'horizontal'
            ? {
                wrapperCol: {
                    span: 14,
                    offset: 4,
                },
            }
            : null;

    const propsDragger = {
        name: 'file',
        multiple: false,
        onChange(info) {
            const {status} = info.file;
            if(status === 'removed') {
                setXslxFile(null);
            }
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    function beforeUpload(file) {

        const isXslx = file.type === 'application/vnd.ms-excel' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXslx) {
            message.error('Chỉ hỗ trợ upload file xslx!');

        } else {
            if(!xslxFile) {
                setXslxFile(file);
            }
        }
        return false;
    }

    async function onUploadXslxFile() {
        if(xslxFile) {
            if(typeAccount == 1) {
                setIsSendinggForm(true);
                const fdt = new FormData();
                fdt.set("employeesFile", xslxFile);
                axios.post("/employees/list", fdt)
                    .then((res) => {
                        console.log(res.data);
                        message.success("Đã thêm thành công danh sách giảng viên")
                    })
                    .then(() => {
                        setIsSendinggForm(false)
                        form.resetFields();
                    })
                    .catch((error) => {
                        setIsSendinggForm(false)
                        console.log(error.response)
                        message.error(error.response.data.message)
                    })
            }
            else if (typeAccount == 2) {
                setIsSendinggForm(true);
                const fdt = new FormData();
                fdt.set("studentsFile", xslxFile);
                axios.post("/students/list", fdt)
                    .then((res) => {
                        console.log(res.data);
                        message.success("Đã thêm thành công danh sách sinh viên")
                    })
                    .then(() => {
                        setIsSendinggForm(false)
                        form.resetFields();
                    })
                    .catch((error) => {
                        setIsSendinggForm(false)
                        message.error(error.response.data.message)
                    })
            }

        }
        else {
            message.info("Không có file nào được chọn!")
        }
    }

    const addingLecturerForm = () => {
        form.resetFields();
        return (
            <Row>
                <Col span={12} offset={1}>
                    <Title level={3}>Thêm mới giảng viên</Title>
                    <Form
                        {...formItemLayout}
                        layout={formLayout}
                        form={form}
                        initialValues={{
                            layout: formLayout,
                        }}
                        onFinish={onCreateAccount}
                    >
                        <Form.Item label="Tên giảng viên:" name="full_name">
                            <Input placeholder="Nhập tên giảng viên"
                                   addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Ngày sinh:" name="birth_date">
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
                        <Form.Item label="Học hàm:" name="academic_rank">
                            <Input placeholder="Học hàm của giảng viên"
                                   addonBefore={<i className="fas fa-brain" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Form.Item label="Học vị:" name="academic_degree">
                            <Input placeholder="Học vị của giảng viên"
                                   addonBefore={<i className="fas fa-medal" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Form.Item label="Đơn vị chuyên môn:" name="institution">
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
                        <Form.Item {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit">Thêm giảng viên</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8} offset={1}>
                    <Form>
                        <Title level={3}>Thêm danh sách giảng viên</Title>
                        <Form.Item>
                            <Dragger
                                {...propsDragger}
                                height={200}
                                beforeUpload={beforeUpload}
                                >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined/>
                                </p>
                                <p className="ant-upload-text">Nhấn hoặc kéo thả danh sách giảng viên vào đây để
                                    upload</p>
                                <p className="ant-upload-hint">
                                    Hỗ trợ file .xslx
                                </p>
                            </Dragger>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" loading={isSendingForm} onClick={onUploadXslxFile}>
                                Thêm danh sách GV
                            </Button>
                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        )
    }

    const addingStudentForm = () => {
        form.resetFields();
        return (
            <Row>
                <Col span={12} offset={1}>
                    <Title level={3}>Thêm mới sinh viên</Title>
                    <Form
                        {...formItemLayout}
                        layout={formLayout}
                        form={form}
                        initialValues={{
                            layout: formLayout,
                        }}
                        onFinish={onCreateAccount}
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
                                        onChange={(val) => console.log(val) }
                                    />
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

                        <Form.Item label="Thuộc chương trình đào tạo:" name="trainingProgram">
                            <Select
                                showSearch
                                style={{width: 200}}
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
                        <Form.Item {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={8} offset={1}>
                    <Title level={3}>Thêm danh sách sinh viên</Title>
                    <Dragger
                        {...propsDragger}
                        height={200}
                        beforeUpload={beforeUpload}

                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">Nhấn hoặc kéo thả danh sách sinh viên vào đây để upload</p>
                        <p className="ant-upload-hint">
                            Hỗ trợ file .xslx
                        </p>
                    </Dragger>
                    <br/>
                    <Button type="primary" onClick={onUploadXslxFile} loading={isSendingForm}>
                        {
                            isSendingForm ? "Loading" : "Thêm danh sách SV"
                        }
                    </Button>

                </Col>
            </Row>
        )
    }

    return !isValidToken ? <Redirect to="/uet/signin"/> : (
        <>
            <Row>
                <Col span={24}>
                    <Tabs defaultActiveKey="1" onTabClick={(e) => {
                        setTypeAccount(e)
                        console.log(e, typeof e)
                    }}>
                        <Tabs.TabPane
                            tab={
                                <span>
                                  <i className="fas fa-chalkboard-teacher"/>&ensp;
                                  Giảng viên
                                </span>
                            }
                            key={1}
                        >{addingLecturerForm()}
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span>
                                  <i className="fas fa-user-graduate"/>&ensp;
                                  Sinh viên
                                </span>
                            }
                            key={2}
                        >{addingStudentForm()}
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>

        </>


    )
};

export default CreateAccountPage;