import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions/index'
import {Button, Cascader, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table, Tag} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
} from "@ant-design/icons";
import axios from "axios";
import {useHistory} from "react-router-dom";
import CreateCoursePage from "../CreateCoursePage";
import {searchAccounts} from "../../redux/actions/index";
import SearchFormCourse from "./SearchFormCourse";

const {Column, ColumnGroup} = Table;

const CollectionCreateForm = ({visible, onCancel, updatedCourse, dispatch}) => {
    const [form] = Form.useForm();
    const {courses} = useSelector(state => state.courses)
    // const [courses, setCourses] = useState([]);
    const {listInstitutions} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);

/*
    useEffect(() => {
        axios.get('/courses')
            .then((res) => {
                setCourses(res.data.courses)
            })
    }, [])
*/

    if (updatedCourse) {
        const required_course = (JSON.parse(updatedCourse.required_course) || []).map(course => course.uuid);
        let parentInstitution = listInstitutions.find(ins => ins.uuid === updatedCourse.institution.parent_uuid)
        form.setFieldsValue(
            {
                ...updatedCourse,
                institutionUuid: [parentInstitution ? parentInstitution.uuid : updatedCourse.institution.uuid, updatedCourse.institution ? updatedCourse.institution.uuid : '']});
        form.setFieldsValue({
            required_course: required_course
        });


    }

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


    return (
        <Modal
            visible={visible}
            title="Cập nhật thông tin học phần"
            okText="Cập nhật"
            cancelText="Thoát"
            onCancel={onCancel}
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
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
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
                            courses.map((course, index) =>
                                <Select.Option value={course.uuid} key={index}>{`${course.course_name_vi} (${course.course_code})`}</Select.Option>
                            )
                        }

                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const ListCoursePage = () => {
    const dispatch = useDispatch();
    const courseState = useSelector(state => state.courses)
    const [dataSource, setDataSource] = useState([]);
    const [visible, setVisible] = useState(false);
    const [updatedCourse, setUpdatedCourse] = useState(null);
    const [isModalCreateVisible, setIsModalCreateVisible] = useState(false);
    const history = useHistory();


 /*   useEffect(() => {
        dispatch(actions.getAllCourse({params: searchObj}))
    }, [searchObj])*/

    useEffect(() => {
        if (courseState.response.data) {
            const dataSource = courseState.response.data.courses.map((course, index) => {
                return {
                    ...course,
                    key: index
                }
            })
            setDataSource(dataSource);
        }
    }, [courseState])

    function deleteCourse({uuid}) {

        axios.delete(`/courses/${uuid}`)
            .then((response) => {
                message.success(response.data.message)
                setDataSource(
                    dataSource.filter((course) => course.uuid !== uuid)
                )
            })
    }

/*    const getColumnSearchProps = (dataIndex) => (
        {
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div style={{padding: 8}}>
                    <Input
                        placeholder={`Tìm kiếm`}
                        onChange={e => {
                            onSearchCourse(dataIndex, e.target.value)
                        }}
                        style={{width: dataIndex == 'course_code' ? 100 : 190, marginBottom: 8, display: 'block'}}
                    />
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        }
    )*/

    /*const onSearchCourse = (dataIndex, searchText) => {
        setSearchObj({...searchObj, [dataIndex]: searchText})
    }*/

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
            <SearchFormCourse />

            <Modal
                title="Thêm mới học phần"
                visible={isModalCreateVisible}
                onOk={handleOkCreate}
                onCancel={handleCancelCreate}
                width='50%'
                footer={null}
            >
                <CreateCoursePage onCancelModal={handleCancelCreate}/>
            </Modal>

            <Table
                dataSource={dataSource}
                loading={courseState.loading}
                bordered
                footer={() => (
                    <Button
                        type="primary"
                        danger
                        icon={<PlusOutlined/>}
                        shape="circle"
                        onClick={showModalCreate}
                    />
                )}
            >
                <Column
                    title="Mã học phần"
                    dataIndex="course_code"
                    key="course_code"

                />
                <ColumnGroup title="Tên học phần">
                    <Column
                        title="Tiếng Việt"
                        dataIndex="course_name_vi"
                        key="course_name_vi"

                    />
                    <Column
                        title="Tiếng Anh"
                        dataIndex="course_name_en"
                        key="course_name_en"
                        /*{...getColumnSearchProps('course_name_en')}*/
                    />
                </ColumnGroup>

                <Column title="Số tín chỉ" dataIndex="credits" key="credits"/>
                <Column
                    title="Đơn vị phụ trách"
                    dataIndex="institution"
                    key="institution"
                    render={
                        (ins) => ins ? ins.vn_name : ''
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
            <CollectionCreateForm
                visible={visible}
                dispatch={dispatch}
                updatedCourse={updatedCourse}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </>
    )
}

export default ListCoursePage;
