import {Button, Cascader, Col, Form, Input, InputNumber, message, Row, Select} from "antd";
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions";
import axios from "axios";
import {Redirect} from "react-router-dom";
import AddLecturerOutlineForm from "../../outline/CreateOutlineCoursePage/AddLecturerOutlineForm";
import TextArea from "antd/lib/input/TextArea";

const CreateCoursePage = ({onCancelModal}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {listInstitutions} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);
    //const courseState = useSelector(state => state.courses)
    const [courses, setCourses] = useState([]);
    const {isValidToken} = useSelector(state => state.auth);
    const [lecturers, setLecturers] = useState([]);
    /*const [xslxFile, setXslxFile] = useState(null);
    const [isSendingForm, setIsSendinggForm] = useState(false);*/

    const getAllCourse = () => {
        axios.get('/courses/', {params: {depAll: true}})
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
        if (values.required_course) {
            values.required_course = JSON.stringify(values.required_course.map(courseUuid => {
                    return courses.find(c => c.uuid === courseUuid)
                })
            )
        }
        try {
            values.institutionUuid
                = values.institutionUuid.length === 2
                ? values.institutionUuid[1]
                : values.institutionUuid[0];
            values.lecturers = lecturers;
            const response = await axios.post("/courses", values)
            message.success(response.data.message);
            form.resetFields();
            dispatch(actions.getAllCourse());
            getAllCourse();
            onCancelModal();

        } catch (e) {
            if (e.response)
                message.error(e.response.data.message);
            else
                message.error(e);
        }

    }

    const formItemLayout =
        {
            labelCol: {span: 6, offset: 1},
            wrapperCol: {span: 15, offset: 0},
        }

    return !isValidToken ? <Redirect to="/uet/signin"/> : (
        <>

                    <Form
                        {...formItemLayout}
                        layout={formItemLayout}
                        form={form}
                        onFinish={onCreateCourse}
                    >
                        <Row justify="space-between">
                            <Col span={12}>
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
                                            return option.children.toLowerCase().indexOf(input.toLowerCase().toString(16)) >= 0
                                        }

                                        }
                                    >
                                        {
                                            courses.map((course, index) =>
                                                <Select.Option value={course.uuid}
                                                               key={index}>{`${course.course_name_vi} (${course.course_code})`}</Select.Option>
                                            )
                                        }

                                    </Select>
                                </Form.Item>


                                <Form.Item wrapperCol={{span: 14, offset: 7}}>
                                    <Button type="primary" htmlType="submit">Thêm học phần</Button>
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item label="Giảng viên phụ trách" name="lecturers">
                                    <AddLecturerOutlineForm lecturers={lecturers} setLecturers={setLecturers}/>
                                </Form.Item>
                                <Form.Item label="Nội dung học phần" name="description">
                                    <TextArea
                                        autoSize
                                    />
                                </Form.Item>
                                <Form.Item label="Tài liệu tham khảo" name="document_url">
                                    <TextArea
                                        autoSize
                                    />
                                </Form.Item>
                            </Col>
                        </Row>



                    </Form>


        </>
    )
};

export default CreateCoursePage;
