import {Button, Col, DatePicker, Form, Input, message, Radio, Row, Select} from "antd";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import Dragger from "antd/lib/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as actions from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {classCodes} from "../../../constants";

const AddingStudentForm = () => {
    const [formStu] = Form.useForm();
    const [formLayout, setFormLayout] = useState('vertical');
    const [xslxFile, setXslxFile] = useState(null);
    const dispatch = useDispatch();
    const {majors} = useSelector(state => state.majors)
    const accState = useSelector(state => state.accounts)
    const {trainingPrograms} = useSelector(state => state.trainingPrograms)
    const [isSendingForm, setIsSendinggForm] = useState(false);
    formStu.resetFields();

    useEffect(() => {
        dispatch(actions.getAllMajor());
        dispatch(actions.getAllTrainingProgram());
    }, [])

    useEffect(() => {
        if(accState.addAccountType === 2) {
            if (accState.error) {
                message.error(accState.error)
            } else if (accState.error === false) {
                message.success("Tạo mới sinh viên thành công")
            }
        }
    }, [accState])

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
            if (status === 'removed') {
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
            if (!xslxFile) {
                setXslxFile(file);
            }
        }
        return false;
    }

    async function onUploadXslxFile() {
        if (xslxFile) {

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
                    formStu.resetFields();
                })
                .catch((error) => {
                    setIsSendinggForm(false)
                    message.error(error.response.data.message)
                })

        } else {
            message.info("Không có file nào được chọn!")
        }
    }

    const onCreateAccountStudent = async (values) => {
        await dispatch(actions.addAccount({values, typeAccount: 2}));
        //formStu.resetFields();
    };


    const UsernamePasswordForm = (
        <>
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
                <Input suffix={<i className="far fa-envelope"/>}/>
            </Form.Item>
            <Form.Item
                label="Mật khẩu"
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
        </>
    )


    return (
        <Row>
            <Col span={12} offset={1}>
                <Title level={3}>Thêm mới sinh viên</Title>
                <Form
                    {...formItemLayout}
                    layout={formLayout}
                    form={formStu}
                    initialValues={{
                        layout: formLayout,
                    }}
                    onFinish={onCreateAccountStudent}
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
                            <Form.Item
                                label="Ngày sinh:"
                                name="birthday"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn một ngày sinh cho sinh viên'
                                    },
                                ]}
                            >
                                <DatePicker
                                    defaultValue={moment('01/01/2021', 'DD/MM/YYYY')}
                                    format={['DD/MM/YYYY', 'DD/MM/YY']}
                                    onChange={(val) => console.log(val)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Giới tính:"
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn giới tính của sinh viên'
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
                            style={{width: '60%'}}
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
                            style={{width: '60%'}}
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
                                {/*<Input
                                    placeholder="C, CLC, CAC, N,..."
                                    addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>*/}
                                <Select
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Lớp môn học của sinh viên"
                                    suffixIcon={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}
                                >
                                    {
                                        classCodes.map((classCode, index) => {
                                            return (
                                                <Select.Option value={classCode} key={index}>{classCode}</Select.Option>
                                            )
                                        })
                                    }
                                </Select>
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
                                    {
                                        whitespace: true,
                                        message: 'Dữ liệu không hợp lệ'
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="K60, K61, K62,..."
                                    addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    {UsernamePasswordForm}
                    <br/>

                    <Form.Item {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">Tạo</Button>
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

export default AddingStudentForm