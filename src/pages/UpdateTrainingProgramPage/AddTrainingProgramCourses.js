import {useEffect, useState} from 'react'
import {Button, Col, Form, InputNumber, message, Row, Select, Space} from 'antd';
import {InboxOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import {useParams} from "react-router";
import Title from "antd/lib/typography/Title";
import Dragger from "antd/lib/upload/Dragger";

const AddTrainingProgramCourses = ({onCloseDrawer, getNewCoursesAdded, trainingProgram}) => {
    const dispatch = useDispatch();
    const courseState = useSelector(state => state.courses)
    const [uploadFile, setUploadFile] = useState(false);
    const [form] = Form.useForm();
    const [addCourseForm] = Form.useForm();
    const [courseType, setCourseType] = useState("B");
    const [requiredCredits, setRequiredCredits] = useState(0);

    let {uuid} = useParams();

    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])

    useEffect(() => {
        if(courseType == 'L') {
            setRequiredCredits(trainingProgram.require_L);
        }
        if(courseType == 'BT') {
            setRequiredCredits(trainingProgram.require_BT);
        }
    }, [courseType])

    const onFinish = values => {
        values.courses = values.courses ? values.courses.map((course) => {
            course.course_type = courseType;
            return course;
        }) : []
        axios.post("/training-programs/courses", {
            courses: values.courses,
            trainingUuid: uuid,
            require_credits: requiredCredits,
            course_type: courseType
        })
            .then((res) => {
                addCourseForm.resetFields();
                /*getNewCoursesAdded(
                    res.data.newCourses.map(course => {
                            course.training_program_course = {
                                theory_time: course.theory_time,
                                exercise_time: course.exercise_time,
                                practice_time: course.practice_time,
                            }
                            return course;
                        }
                    ))*/
                dispatch(actions.getATrainingProgram({id: uuid}))
            })
            .then(() => {
                onCloseDrawer();
                values.courses.length > 0 ?
                    message.success("Thêm học phần vào CTĐT thành công") :
                    message.success("Cập nhật số tín chỉ yêu cầu thành công")
            })
            .catch((e) => {
                if (e.response) {
                    message.error(e.response.data.message)
                } else {
                    message.error(e.message);
                }

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
            <Space >
                <Space align="baseline">
                    <h4>
                        Loại học phần:
                    </h4>
                    <Select
                        showSearch
                        defaultValue={courseType}
                        placeholder="Loại học phần"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(val) => {
                            setCourseType(val)
                        }}
                    >
                        <Select.Option value="B"
                                       key={1}>Bắt buộc</Select.Option>
                        <Select.Option value="L"
                                       key={2}>Tự chọn</Select.Option>
                        <Select.Option value="BT"
                                       key={3}>Bổ trợ</Select.Option>
                        <Select.Option value="TACS"
                                       key={4}>Tiếng anh cơ sở</Select.Option>
                    </Select>
                </Space>

                {
                   courseType == 'L' || courseType == 'BT' ? <Space align="baseline">
                        <h4>
                            Số tín chỉ yêu cầu:
                        </h4>
                        <InputNumber
                            min={1}
                            max={100}
                            value={requiredCredits}
                            onChange={(val) => {
                                setRequiredCredits(val);
                            }}
                        />
                    </Space> : ''
                }
            </Space>
            <br/><br/>
            <Row>
                {uploadFile ? <UploadFileComponent/> :
                    <Col span={24}>
                        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off" form={addCourseForm}>
                            <Form.List name="courses">
                                {
                                    (fields, {add, remove}) => (
                                        <>
                                            {fields.map(field => (

                                                <Row justify="space-between">
                                                    <Col span={10}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'course_uuid']}
                                                            fieldKey={[field.fieldKey, 'course_uuid']}
                                                        >
                                                            <Select
                                                                showSearch
                                                                style={{width: '100%'}}
                                                                placeholder="Tên học phần"
                                                                optionFilterProp="children"
                                                                filterOption={(input, option) =>
                                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                            >
                                                                {
                                                                    courseState.response.data.courses
                                                                        .filter((course => {
                                                                            return !trainingProgram.courses
                                                                                .map(c => c.uuid)
                                                                                .includes(course.uuid)

                                                                        }))
                                                                        .map((ins, index) =>
                                                                        <Select.Option value={ins.uuid}
                                                                                       key={index}>{`${ins.course_name_vi} - ${ins.course_code}`}</Select.Option>
                                                                    )
                                                                }

                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'theory_time']}
                                                            fieldKey={[field.fieldKey, 'theory_time']}
                                                            rules={[{required: true, message: 'Nhập số giờ lý thuyết'}]}
                                                        >
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                placeholder="Số giờ lý thuyết"
                                                                style={{width: '100%'}}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'exercise_time']}
                                                            fieldKey={[field.fieldKey, 'exercise_time']}
                                                            rules={[{required: true, message: 'Nhập số giờ bài tập'}]}
                                                        >
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                placeholder="Số giờ bài tập"
                                                                style={{width: '100%'}}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={4}>
                                                        <Form.Item
                                                            {...field}
                                                            name={[field.name, 'practice_time']}
                                                            fieldKey={[field.fieldKey, 'practice_time']}
                                                            rules={[{required: true, message: 'Nhập số giờ thực hành'}]}
                                                        >
                                                            <InputNumber
                                                                min={1}
                                                                max={100}
                                                                placeholder="Số giờ thực hành"
                                                                style={{width: '100%'}}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={2}>
                                                        &ensp;<MinusCircleOutlined onClick={() => remove(field.name)}/>
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