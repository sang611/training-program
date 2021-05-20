import {Button, Cascader, Col, Form, Input, InputNumber, message, Row, Select} from "antd";
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import {Redirect} from "react-router-dom";

const CreateCoursePage = ({onCancelModal}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {listInstitutions} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);
    //const courseState = useSelector(state => state.courses)
    const [courses, setCourses] = useState([]);
    const {isValidToken} = useSelector(state => state.auth)
    const [xslxFile, setXslxFile] = useState(null);
    const [isSendingForm, setIsSendinggForm] = useState(false);

    const getAllCourse = () => {
        axios.get('/courses')
            .then((res) => {
                setCourses(res.data.courses)
            })
    }

    useEffect(() => {
        dispatch(actions.getAllInstitution());
        getAllCourse();

        form.setFieldsValue({
            course_name_en: ""
        })
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

    async function onCreateCourse(values) {
        if(values.required_course) {
            values.required_course = JSON.stringify( values.required_course.map(courseUuid => {
                    return courses.find(c => c.uuid === courseUuid)
                })
            )
        }
        try {
            values.institutionUuid
                = values.institutionUuid.length === 2
                ? values.institutionUuid[1]
                : values.institutionUuid[0]
            const response = await axios.post("/courses", values)
            message.success(response.data.message);
            form.resetFields();
            dispatch(actions.getAllCourse());
            getAllCourse();
            onCancelModal();

        } catch (e) {
            if(e.response)
                message.error(e.response.data.message);
            else
                message.error(e);
        }

    }

    const propsDragger = {
        name: 'file',
        multiple: false,
        onChange(info) {
            const {status} = info.file;
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
            setXslxFile(file);
        }
        return false;
    }

    async function onUploadXslxFile() {
        if (xslxFile) {
            setIsSendinggForm(true);
            const fdt = new FormData();
            fdt.set("coursesFile", xslxFile);
            axios.post("/courses/list", fdt)
                .then((res) => {
                    console.log(res.data);
                    message.success("Đã thêm thành công danh sách học phần")
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
        } else {
            message.info("Không có file nào được chọn!")
        }
    }

    const formItemLayout =
        {
            labelCol: {span: 5, offset: 1},
            wrapperCol: {span: 14, offset: 1},
        }


    return !isValidToken ? <Redirect to="/uet/signin"/> : (
        <>
            <Row>
                <Col span={24}>
                    <Form
                        {...formItemLayout}
                        layout={formItemLayout}
                        form={form}
                        onFinish={onCreateCourse}
                    >

                        <Form.Item
                            label="Tên học phần (VN):"
                            name="course_name_vi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Tên học phần không được bỏ trống'
                                },
                            ]}
                        >
                            <Input placeholder="Tên học phần bằng Tiếng Việt"
                                   addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Form.Item label="Tên học phần (EN):" name="course_name_en">
                            <Input placeholder="Tên học phần bằng Tiếng Anh"
                                   addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <Form.Item
                            label="Mã học phần:"
                            name="course_code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mã học phần không được bỏ trống'
                                },
                            ]}
                        >
                            <Input placeholder="Nhập mã học phần"
                                   addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <Form.Item
                            label="Số tín chỉ:"
                            name="credits"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập số tín chỉ của học phần'
                                },
                            ]}
                        >
                            <InputNumber min={0} max={20} defaultValue={0}/>
                        </Form.Item>
                        <Form.Item
                            label="Đơn vị chuyên môn:"
                            name="institutionUuid"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chọn đơn vị phụ trách học phần'
                                },
                            ]}
                        >
                            {/*<Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder="Đơn vị chuyên môn phụ trách học phần"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    listInstitutions.map((ins, index) =>
                                        <Select.Option value={ins.uuid} key={index}>{ins.vn_name}</Select.Option>
                                    )

                                }

                            </Select>*/}
                            <Cascader
                                style={{width: '100%'}}
                                options={
                                    institutions.filter((ins) => !ins.parent_uuid)
                                }
                                placeholder="Chọn đơn vị chuyên môn"
                                changeOnSelect
                            />
                        </Form.Item>
                        <Form.Item label="Học phần tiên quyết:" name="required_course">
                            <Select
                                showSearch
                                mode="multiple"
                                allowClear
                                style={{width: '100%'}}
                                placeholder="Chọn học phần tiên quyết"
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    console.log(input, option.children.toLowerCase().indexOf(input.toLowerCase()))
                                    return option.children.toLowerCase().indexOf(input.toLowerCase().toString(16)) >= 0
                                }

                                }
                            >
                                {
                                    courses.map((course, index) =>
                                        <Select.Option value={course.uuid} key={index}>{`${course.course_name_vi} (${course.course_code})`}</Select.Option>
                                    )
                                }

                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 14, offset: 7 }}  >
                            <Button type="primary" htmlType="submit">Thêm</Button>
                        </Form.Item>

                    </Form>
                </Col>
                {/*<Col span={10} offset={4}>
                    <Form>
                        <Title level={3}>Thêm danh sách học phần</Title>
                        <Form.Item>
                            <Dragger
                                {...propsDragger}
                                height={200}
                                beforeUpload={beforeUpload}
                                onRemove={() => {
                                    setXslxFile(null)
                                }}>
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

                        <br/><br/>
                        <Form.Item>
                            <Button type="primary" loading={isSendingForm} onClick={onUploadXslxFile}>
                                {
                                    isSendingForm ? "Loading" : "Submit"
                                }
                            </Button>
                        </Form.Item>

                    </Form>
                </Col>*/}
            </Row>

        </>
    )
};

export default CreateCoursePage;
