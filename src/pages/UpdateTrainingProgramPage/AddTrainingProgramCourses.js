import {useEffect, useState} from 'react'
import {Form, Input, Button, Space, Col, Row, Select, InputNumber, Tag, message, Divider, Switch} from 'antd';
import {CheckOutlined, CloseOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import {useParams} from "react-router";
import Title from "antd/lib/typography/Title";
import Dragger from "antd/lib/upload/Dragger";

const AddTrainingProgramCourses = ({onCloseDrawer, getNewCoursesAdded}) => {
    const dispatch = useDispatch();
    const courseState = useSelector(state => state.courses)
    const [uploadFile, setUploadFile] = useState(false);
    const [form] = Form.useForm();
    const [addCourseForm] = Form.useForm();

    let {uuid} = useParams();

    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])

    const onFinish = values => {
        console.log('Received values of form:', values);
        axios.post("/training-programs/courses", {
            courses: values.courses,
            trainingUuid: uuid
        })
            .then((res) => {
                addCourseForm.resetFields();
                getNewCoursesAdded(
                    res.data.newCourses.map(course => {
                            course.training_program_course = {
                                theory_time: course.theory_time,
                                exercise_time: course.exercise_time,
                                practice_time: course.practice_time,
                            }
                            return course;
                        }
                    ))
            })
            .then(() => {
                onCloseDrawer();
                message.success("Thêm học phần vào CTĐT thành công")
            })
            .catch((e) => {
                console.log(e.response)
                message.error(e.response.data.message)
            })
    };

    const UploadFileComponent = () => {
        const [xslxFile, setXslxFile] = useState(null);
        const [isSendingForm, setIsSendinggForm] = useState(false);
        const propsDragger = {
            name: 'file',
            multiple: false,
            showUploadList: xslxFile ? true : false,
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
                setXslxFile(null);
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
                fdt.set("trainingUuid", uuid)
                axios.post("/training-programs/courses/file", fdt)
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

        return <Form>
            <Title level={4}>Thêm danh sách học phần</Title>
            <Form.Item>
                <Dragger
                    {...propsDragger}
                    height={200}
                    beforeUpload={beforeUpload}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">Nhấn hoặc kéo thả danh sách học phần để
                        upload</p>
                    <p className="ant-upload-hint">
                        Chỉ hỗ trợ file có định dạng .xslx
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
    }


    return (
        <>
            <Title level={3}>
                {/*<Switch
                    checkedChildren="Thêm bằng file"
                    unCheckedChildren="Thêm "
                    defaultChecked
                    onChange={(value) => {
                        setUploadFile(value);
                    }}
                />
                <br/>*/}
            </Title>
            <Row>
                {uploadFile ? <UploadFileComponent/> :
                    <Col span={24}>
                        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={addCourseForm}>
                            {/*<Row justify="start">
                                <Col span={8}>
                                    <Tag color="#303641">Tên học phần</Tag>
                                </Col>
                                <Col span={3}>
                                    <Tag color="#303641">Số giờ lý thuyết</Tag>
                                </Col>
                                <Col span={3}>
                                    <Tag color="#303641">Số giờ bài tập</Tag>
                                </Col>
                                <Col span={4}>
                                    <Tag color="#303641">Số giờ thực hành</Tag>
                                </Col>
                                <Col span={3}>
                                    <Tag color="#303641">Loại học phần</Tag>
                                </Col>

                            </Row>*/}
                            <br/>
                            <Form.List name="courses">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map(field => (

                                            <Row justify="space-between">
                                                <Col span={8}>
                                                    <Form.Item
                                                        {...field}
                                                        style={{width: 250}}
                                                        name={[field.name, 'course_uuid']}
                                                        fieldKey={[field.fieldKey, 'course_uuid']}
                                                    >
                                                        <Select
                                                            showSearch

                                                            placeholder="Tên học phần"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {
                                                                courseState.response.data.courses.map((ins, index) =>
                                                                    <Select.Option value={ins.uuid}
                                                                                   key={index}>{ins.course_name_vi}</Select.Option>
                                                                )
                                                            }

                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'theory_time']}
                                                        fieldKey={[field.fieldKey, 'theory_time']}
                                                        rules={[{required: true, message: 'Nhập số giờ lý thuyết'}]}
                                                    >
                                                        <InputNumber min={1} max={100} placeholder="Số giờ lý thuyết"/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'exercise_time']}
                                                        fieldKey={[field.fieldKey, 'exercise_time']}
                                                        rules={[{required: true, message: 'Nhập số giờ bài tập'}]}
                                                    >
                                                        <InputNumber min={1} max={100} placeholder="Số giờ bài tập"/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'practice_time']}
                                                        fieldKey={[field.fieldKey, 'practice_time']}
                                                        rules={[{required: true, message: 'Nhập số giờ thực hành'}]}
                                                    >
                                                        <InputNumber min={1} max={100} placeholder="Số giờ thực hành"/>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        style={{width: 100}}
                                                        name={[field.name, 'course_type']}
                                                        fieldKey={[field.fieldKey, 'course_type']}
                                                    >
                                                        <Select
                                                            showSearch
                                                            placeholder="Loại học phần"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {
                                                                ["B", "L"].map((type, index) =>
                                                                    <Select.Option value={type}
                                                                                   key={index}>{type}</Select.Option>
                                                                )
                                                            }

                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2}>
                                                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                                </Col>
                                            </Row>

                                        ))}
                                        <Form.Item>
                                            <Button
                                                block
                                                onClick={() => add()} icon={<PlusOutlined/>}
                                            >
                                                Thêm học phần
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Thêm vào khung đào tạo
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                }
            </Row>

        </>
    )
}

export default AddTrainingProgramCourses;