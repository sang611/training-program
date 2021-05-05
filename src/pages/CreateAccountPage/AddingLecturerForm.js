import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Button, Cascader, Col, DatePicker, Form, Input, message, Radio, Row} from "antd";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import Dragger from "antd/lib/upload/Dragger";
import {InboxOutlined, MailTwoTone} from "@ant-design/icons";
import * as actions from "../../redux/actions";
import axios from "axios";

const AddingLecturerForm = () => {
    const [formLec] = Form.useForm();
    formLec.resetFields();
    const [formLayout, setFormLayout] = useState('vertical');
    const {listInstitutions} = useSelector(state => state.institutions)
    const accState = useSelector(state => state.accounts)
    const [institutions, setInstitutions] = useState([]);
    const [xslxFile, setXslxFile] = useState(null);
    const [isSendingForm, setIsSendinggForm] = useState(false);
    const dispatch = useDispatch();

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
        if(accState.addAccountType === 1) {
            if (accState.error) {
                message.error("Đã có lỗi xảy ra")
            } else if (accState.error === false) {
                message.success("Tạo mới giảng viên thành công")
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

    const onCreateAccountLecturer = async (values) => {
        values.institution = values.institution.length === 2 ? values.institution[1] : values.institution[0]
        await dispatch(actions.addAccount({values, typeAccount: 1}));
        formLec.resetFields();
    };


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
            fdt.set("employeesFile", xslxFile);
            axios.post("/employees/list", fdt)
                .then((res) => {
                    console.log(res.data);
                    message.success("Đã thêm thành công danh sách giảng viên")
                })
                .then(() => {
                    setIsSendinggForm(false)
                    formLec.resetFields();
                })
                .catch((error) => {
                    setIsSendinggForm(false)
                    console.log(error.response)
                    message.error(error.response.data.message)
                })

        } else {
            message.info("Không có file nào được chọn!")
        }
    }

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
                <Title level={3}>Thêm mới giảng viên</Title>
                <Form
                    {...formItemLayout}
                    layout={formLayout}
                    form={formLec}
                    initialValues={{
                        layout: formLayout,
                    }}
                    onFinish={onCreateAccountLecturer}
                >
                    <Form.Item
                        label="Họ tên giảng viên:"
                        name="fullname"
                        rules={[
                            {
                                required: true,
                                message: 'Tên giảng viên không được để trống'
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên giảng viên"
                               addonBefore={<i className="fas fa-signature" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>
                    <Row>
                        {/*<Col span={12}>
                            <Form.Item
                                label="Ngày sinh:"
                                name="birth_date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn 1 ngày sinh cho giảng viên'
                                    },
                                ]}
                            >
                                <DatePicker defaultValue={moment('01/01/2021', 'DD/MM/YYYY')}
                                            format={['DD/MM/YYYY', 'DD/MM/YY']}/>
                            </Form.Item>
                        </Col>*/}
                        <Col span={12}>
                            <Form.Item
                                label="Giới tính:"
                                name="gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn giới tính của giảng viên'
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
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Học hàm:" name="academic_rank">
                                <Input
                                    placeholder="Học hàm của giảng viên"
                                    addonBefore={<i className="fas fa-brain" style={{color: '#1890FF'}}/>}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Học vị:" name="academic_degree">
                                <Input placeholder="Học vị của giảng viên"
                                       addonBefore={<i className="fas fa-medal" style={{color: '#1890FF'}}/>}/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.Item
                        label="Đơn vị chuyên môn:"
                        name="institution"
                        rules={[
                            {
                                required: true,
                                message: 'Chọn 1 đơn vị giảng viên làm việc'
                            },
                        ]}
                    >
                        <Cascader
                            style={{width: '100%'}}
                            options={
                                institutions.filter((ins) => !ins.parent_uuid)
                            }
                            placeholder="Chọn đơn vị chuyên môn"
                            changeOnSelect
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

                    {UsernamePasswordForm}
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

export default AddingLecturerForm