import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions'
import {
    Button,
    Cascader,
    Col,
    Collapse,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag
} from "antd";
import {DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import {useHistory} from "react-router-dom";
import CreateCoursePage from "../CreateCoursePage";
import SearchFormCourse from "./SearchFormCourse";
import AddLecturerOutlineForm from "../../outline/CreateOutlineCoursePage/AddLecturerOutlineForm";
import TextArea from "antd/lib/input/TextArea";

const {Column, ColumnGroup} = Table;

const UpdateCourseForm = ({visible, onCancel, updatedCourse, dispatch, allCourses}) => {
    const [form] = Form.useForm();
    const {courses} = useSelector(state => state.courses)
    const {listInstitutions} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);
    const [lecturers, setLecturers] = useState([]);


    useEffect(() => {
        if (updatedCourse) {
            const required_course = (JSON.parse(updatedCourse.required_course) || []).map(course => course.uuid);
            let parentInstitution = listInstitutions.find(ins => ins.uuid === updatedCourse.institution.parent_uuid)
            form.setFieldsValue(
                {
                    ...updatedCourse,
                    required_course: required_course,
                    institutionUuid: [parentInstitution ? parentInstitution.uuid : updatedCourse.institution.uuid, updatedCourse.institution ? updatedCourse.institution.uuid : ''],
                });
            setLecturers(updatedCourse.employees)
        }
    }, [updatedCourse])


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

    const formItemLayout =
        {
            labelCol: {span: 6, offset: 1},
            wrapperCol: {span: 15, offset: 0},
        }

    return (
        <Modal
            visible={visible}
            title="Cập nhật thông tin học phần"
            okText="Cập nhật"
            cancelText="Thoát"
            onCancel={onCancel}
            width='80%'
            style={{
                top: '20px'
            }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        console.log(values)
                        values.required_course = JSON.stringify(
                            values.required_course.map(id => {
                                return courses.find(course => course.uuid === id);
                            })
                        )
                        axios.put(`/courses/${updatedCourse.uuid}`,
                            {
                                ...values,
                                lecturers,
                                institutionUuid: values.institutionUuid.length === 2 ? values.institutionUuid[1] : values.institutionUuid[0]
                            }
                        )
                            .then((res) => message.success("Cập nhật thành công"))
                            .catch(() => "Không thể cập nhật")

                    })
                    .then(() => {
                        form.resetFields();
                        dispatch(actions.getAllCourse())
                        onCancel();
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}

        >
            <Form
                form={form}
                {...formItemLayout}
                layout={formItemLayout}
                name="form_in_modal"
                initialValues={{}}
            >
                <Row justify="space-between">
                    <Col span={12}>

                        <Form.Item label="Tên học phần (VN):" name="course_name_vi">
                            <Input placeholder="Tên học phần bằng Tiếng Việt"
                                   addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>
                        <Form.Item label="Tên học phần (EN):" name="course_name_en">
                            <Input placeholder="Tên học phần bằng Tiếng Anh"
                                   addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <Form.Item label="Mã học phần:" name="course_code">
                            <Input placeholder="Nhập mã học phần"
                                   addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                        </Form.Item>

                        <Form.Item label="Số tín chỉ:" name="credits">
                            <InputNumber min={1} max={20}/>
                        </Form.Item>

                        <Form.Item label="Đơn vị chuyên môn:" name="institutionUuid">
                            <Cascader
                                style={{width: '100%'}}
                                options={
                                    institutions.filter((ins) => !ins.parent_uuid)
                                }
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
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    allCourses.map((course, index) =>
                                        <Select.Option value={course.uuid}
                                                       key={index}>{`${course.course_name_vi} (${course.course_code})`}</Select.Option>
                                    )
                                }

                            </Select>
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
        </Modal>
    );
};

const ListCoursePage = () => {
    const dispatch = useDispatch();
    const courseState = useSelector(state => state.courses)
    const {courses} = useSelector(state => state.courses)
    const [dataSource, setDataSource] = useState([]);
    const [visible, setVisible] = useState(false);
    const [updatedCourse, setUpdatedCourse] = useState(null);
    const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
    const history = useHistory();
    const [allCourses, setAllCourses] = useState([]);
    const [flag, setFlag] = useState(true);

    console.log("re render")

    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])

    useEffect(() => {
        axios.get(`/courses`, {params: {depAll: true}})
            .then((res) => setAllCourses(res.data.courses))
    }, [])

    useEffect(() => {

        const dataSource = courses.map((course, index) => {
            return {
                ...course,
                key: index
            }
        })
        setDataSource(dataSource);

    }, [courseState])

    function deleteCourse({uuid}) {

        axios.delete(`/courses/${uuid}`)
            .then((response) => {
                message.success(response.data.message)
                /*setDataSource(
                    dataSource.filter((course) => course.uuid !== uuid)
                )*/
                dispatch(actions.getAllCourse());
            })
    }

    const showModalCreate = () => {
        setIsModalCreateVisible(true);
    };

    const handleOkCreate = () => {
        setIsModalCreateVisible(false);
    };

    const handleCancelCreate = () => {
        setIsModalCreateVisible(false);
    };

    return (
        <>
            <Collapse bordered={true} defaultActiveKey={[]}>
                <Collapse.Panel header="Tìm kiếm học phần" key="1">
                    <SearchFormCourse/>
                </Collapse.Panel>
            </Collapse>
            <br/>
            <Row justify="space-between">
                <i><b>
                    {`${courses.length} học phần`}
                </b></i>
                <Button
                    type="primary"
                    danger
                    icon={<PlusOutlined/>}
                    shape="round"
                    onClick={showModalCreate}
                >
                    Thêm mới học phần
                </Button>
            </Row>
            <br/>
            <Modal
                title="Thêm mới học phần"
                visible={isModalCreateVisible}
                onOk={handleOkCreate}
                onCancel={handleCancelCreate}
                width='80%'
                footer={null}
            >
                <CreateCoursePage onCancelModal={handleCancelCreate}/>
            </Modal>

            <Table
                dataSource={dataSource}
                loading={courseState.loading}
                bordered
                pagination={{
                    showSizeChanger: false
                }}
            >
                <Column
                    title="Mã học phần"
                    dataIndex="course_code"
                    key="course_code"
                    sorter={
                        {
                            compare: (a, b) => a.course_code.localeCompare(b.course_code),
                        }
                    }
                />
                <ColumnGroup title="Tên học phần">
                    <Column
                        title="Tiếng Việt"
                        dataIndex="course_name_vi"
                        key="course_name_vi"
                        sorter={
                            {
                                compare: (a, b) => a.course_name_vi.localeCompare(b.course_name_vi),
                            }
                        }
                    />
                    <Column
                        title="Tiếng Anh"
                        dataIndex="course_name_en"
                        key="course_name_en"
                        /*{...getColumnSearchProps('course_name_en')}*/
                    />
                </ColumnGroup>

                <Column
                    title="Số tín chỉ"
                    dataIndex="credits"
                    key="credits"
                    sorter={
                        {
                            compare: (a, b) => a.credits - b.credits,
                        }
                    }
                />
                <Column
                    title="Đơn vị phụ trách"
                    dataIndex={["institution", "vn_name"]}
                    key="institution"
                    sorter={
                        {
                            compare: (a, b) => a.institution.vn_name.localeCompare(b.institution.vn_name),
                        }
                    }

                />
                <Column
                    title="Thao tác"
                    key="action"
                    render={(text, record) => (
                        <Space size="small">
                            <a onClick={() => {
                                setUpdatedCourse(record);
                                setVisible(true);
                            }}>
                                <Tag icon={<EditOutlined/>} color="#55acee">
                                    Sửa
                                </Tag>
                            </a>
                            <a>
                                <Popconfirm
                                    title="Xóa học phần này?"
                                    onConfirm={() => {
                                        deleteCourse(record);
                                    }}
                                >
                                    <Tag icon={<DeleteOutlined/>} color="#cd201f">
                                        Xóa
                                    </Tag>
                                </Popconfirm>

                            </a>

                            <a>
                                <Tag
                                    icon={<InfoCircleOutlined/>}
                                    color="#87d068"
                                    onClick={() => history.push(`/uet/courses/${record.uuid}/outlines`)}>
                                    Đề cương
                                </Tag>
                            </a>
                        </Space>
                    )}
                />
            </Table>
            <UpdateCourseForm
                visible={visible}
                dispatch={dispatch}
                updatedCourse={updatedCourse}
                allCourses={allCourses}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </>
    )
}

export default ListCoursePage;
