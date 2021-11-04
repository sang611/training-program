import {useEffect, useState} from 'react'
import {Button, Col, Form, InputNumber, message, Row, Select, Space} from 'antd';
import {InboxOutlined, MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions";
import axios from "axios";
import {useParams} from "react-router";
import Title from "antd/lib/typography/Title";
import Dragger from "antd/lib/upload/Dragger";

const AddTrainingProgramCourses = ({onCloseDrawer, getNewCoursesAdded, trainingProgram, coursesOfTraining}) => {
    const dispatch = useDispatch();
    const {courses} = useSelector(state => state.courses)
    const [uploadFile, setUploadFile] = useState(false);
    const [addCourseForm] = Form.useForm();
    const [courseType, setCourseType] = useState("B");
    const [knowledgeType, setKnowledgeType] = useState("C");
    const [requiredCredits, setRequiredCredits] = useState(0);
    const [fields, setFields] = useState([]);
    const [totalCreditsAdded, setTotalCreditsAdded] = useState(0);

    let {uuid} = useParams();

    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])

    useEffect(() => {
        if (courseType == 'L') {
            setRequiredCredits(trainingProgram.require_L);
        }
        if (courseType == 'BT') {
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
            course_type: courseType,
            knowledge_type: knowledgeType
        })
            .then((res) => {
                addCourseForm.resetFields();
                dispatch(actions.getATrainingProgram({id: uuid}))
            })
            .then(() => {
                onCloseDrawer();

                message.success("Thêm học phần vào CTĐT thành công")

            })
            .catch((e) => {
                if (e.response) {
                    message.error(e.response.data.message)
                } else {
                    message.error(e.message);
                }

            })
    };

    const onChangeFields = (changedField, allFields) => {

        let fieldChange = changedField[0].value;
        let total = totalCreditsAdded;
        console.log(fieldChange, fields)
        if (Array.isArray(fieldChange) && fieldChange.length < fields.length) {

            for (let f of fields) {
                if (!fieldChange.map(fc => fc.course_uuid).includes(f)) {
                    console.log("remove ", f)
                    total -= courses.filter(course => course.uuid === f)[0].credits;
                    setTotalCreditsAdded(total);
                    let indexRemove = fields.indexOf(f);
                    setFields([...fields].filter((f, index) => index !== indexRemove))
                }

            }

        }

        if (changedField[0].name[1] !== undefined && changedField[0].name[2] && changedField[0].name[2] === "course_uuid") {
            let indexAdd = changedField[0].name[1];

            let fields_ = [...fields];


            if (indexAdd < fields.length && changedField[0].value) {
                total -= courses.filter(course => course.uuid === fields_[indexAdd])[0].credits;
                fields_[indexAdd] = changedField[0].value;
            } else {
                fields_.push(changedField[0].value);
            }
            setFields(fields_);

            courses
                .forEach((course) => {

                    if (course.uuid === changedField[0].value) {
                        total += course.credits;
                    }

                })

            setTotalCreditsAdded(total);
        }

    }


    /*const UploadFileComponent = () => {
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
    }*/


    return (
        <>
            <Title level={3}>
            </Title>
            <Space>
                <Space align="baseline">
                    <h4>
                        Khối kiến thức:
                    </h4>
                    <Select
                        placeholder="Khối kiến thức"
                        style={{width: '150px'}}
                        value={knowledgeType}
                        onChange={(val) => {
                            setKnowledgeType(val)
                        }}
                    >
                        <Select.Option value="C"
                                       key={1}>Chung</Select.Option>
                        <Select.Option value="LV"
                                       key={2}>Lĩnh vực</Select.Option>
                        <Select.Option value="KN"
                                       key={3}>Khối ngành</Select.Option>
                        <Select.Option value="NN"
                                       key={4}>Nhóm ngành</Select.Option>
                        <Select.Option value="N"
                                       key={5}>Ngành</Select.Option>
                    </Select>
                </Space>
                {/*<Space align="baseline">
                    <h4>
                        Loại học phần:
                    </h4>
                    <Select
                        value={courseType}
                        placeholder="Loại học phần"
                        optionFilterProp="children"
                        style={{width: '200px'}}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(val) => {
                            setCourseType(val)
                        }}
                        disabled={knowledgeType === 'C' || knowledgeType === 'LV'}
                    >
                        <Select.Option value="B"
                                       key={1}>Bắt buộc</Select.Option>
                        <Select.Option value="L"
                                       key={2}>Tự chọn</Select.Option>
                        <Select.Option value="BT"
                                       key={3}>Bổ trợ</Select.Option>
                        <Select.Option value="KLTN"
                                       key={4}>Khóa luận tốt nghiệp</Select.Option>
                    </Select>
                </Space>*/}

                <Space align="baseline">
                    {totalCreditsAdded} tín chỉ
                </Space>
            </Space>
            <br/><br/>
            <Row>

                <Col span={24}>
                    <Form
                        name="dynamic_form_nest_item"
                        onFinish={onFinish}
                        autoComplete="off"
                        form={addCourseForm}
                        onFieldsChange={(changedFields, allFields) => onChangeFields(changedFields, allFields)}
                    >
                        <Form.List
                            name="courses"
                            rules={[
                                {
                                    validator: async (_, courses) => {
                                        if (!courses || courses.length < 1) {
                                            return Promise.reject(new Error('Cần thêm ít nhất 1 học phần'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {
                                (fields, {add, remove}, {errors}) => (
                                    <>
                                        {fields.map(field => (
                                            <Row justify="space-between">
                                                <Col span={7}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'course_uuid']}
                                                        fieldKey={[field.fieldKey, 'course_uuid']}
                                                        rules={[{required: true, message: 'Chọn 1 học phần'}]}
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
                                                                courses
                                                                    .filter((course => {
                                                                        return !coursesOfTraining
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
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'theory_time']}
                                                        fieldKey={[field.fieldKey, 'theory_time']}
                                                        //rules={[{required: true, message: 'Nhập số giờ lý thuyết'}]}
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            max={100}
                                                            placeholder="Lý thuyết"
                                                            style={{width: '100%'}}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'exercise_time']}
                                                        fieldKey={[field.fieldKey, 'exercise_time']}
                                                        //rules={[{required: true, message: 'Nhập số giờ bài tập'}]}
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            max={100}
                                                            placeholder="Bài tập"
                                                            style={{width: '100%'}}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'practice_time']}
                                                        fieldKey={[field.fieldKey, 'practice_time']}
                                                        //rules={[{required: true, message: 'Nhập số giờ thực hành'}]}
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            max={100}
                                                            placeholder="Thực hành"
                                                            style={{width: '100%'}}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'self_time']}
                                                        fieldKey={[field.fieldKey, 'self_time']}
                                                        //rules={[{required: true, message: 'Nhập số giờ tự học'}]}
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            max={100}
                                                            placeholder="Tự học"
                                                            style={{width: '100%'}}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={3}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'self_time']}
                                                        fieldKey={[field.fieldKey, 'course_type']}
                                                    >
                                                        <Select
                                                            placeholder="Loại"
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                            disabled={knowledgeType === 'C' || knowledgeType === 'LV'}
                                                        >
                                                            <Select.Option value="B"
                                                                           key={1}>Bắt buộc</Select.Option>
                                                            <Select.Option value="L"
                                                                           key={2}>Tự chọn</Select.Option>
                                                            <Select.Option value="BT"
                                                                           key={3}>Bổ trợ</Select.Option>
                                                            <Select.Option value="KLTN"
                                                                           key={4}>Khóa luận tốt nghiệp</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2}>
                                                    &ensp;<MinusCircleOutlined onClick={() => remove(field.name)}/>
                                                </Col>
                                            </Row>

                                        ))}
                                        <Form.Item>
                                            <Form.ErrorList errors={errors}/>
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

            </Row>

        </>
    )
}

export default AddTrainingProgramCourses;