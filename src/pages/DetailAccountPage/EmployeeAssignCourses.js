import {Button, Checkbox, Form, message, Popconfirm, Select, Space, Table, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import * as actions from '../../redux/actions'
import axios from "axios";
import {DeleteOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {useHistory, useParams} from "react-router-dom";

const {Column, ColumnGroup} = Table;


const EmployeeAssignCourses = ({employee}) => {
    const dispatch = useDispatch();
    const {courses} = useSelector(state => state.courses)
    const {userRole} = useSelector(state => state.auth)
    const history = useHistory();
    const {uuid} = useParams();
    useEffect(() => {
        dispatch(actions.getAllCourse());
    }, [])

    const onAssignCourse = (courses) => {
        console.log(courses)
        axios.post(`/employee-courses/assignment`, {
            employeeUuid: employee.uuid,
            courses: courses.courses
        })
            .then(r => {
                message.success(r.data.message)
                dispatch(actions.getDetailUser({accountUuid: uuid}))
            })
            .catch(e => message.error(e.response.data.message))
    }

    const onGrantModerator = (e, course) => {
        console.log(e.target.checked, course)

    }

    useEffect(() => {
        setSelectedRowKeys(
            employee.courses.map((course) =>
                course.employee_Course.isModerator ? course.uuid : ''
            )
        )
    }, [])

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const checkIsModerator = (record) => {
        return !!employee.courses.find((course) => course.uuid == record.uuid).employee_Course.isModerator
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys)

        },

        selectedRowKeys: selectedRowKeys,
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows)
            axios.put('/employee-courses/grant', {
                employeeUuid: employee.uuid,
                courseUuid: record.uuid,
                isModerator: selected
            })
                .then((r) => {
                    message.success(r.data.message)
                })
                .catch((e) =>
                    message.error(e.response.data.message)
                )
        }
    };
    return (
        <>
            <Table
                dataSource={
                    employee.courses.map(course => {
                        course.key = course.uuid;
                        return course;
                    })
                }
                bordered
                pagination={false}
                rowSelection={userRole == 0 ? {
                    type: 'checkbox',
                    ...rowSelection,
                } : ''}
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

                    />
                </ColumnGroup>

                <Column title="Số tín chỉ" dataIndex="credits" key="credits"/>
                <Column
                    title="Đơn vị phụ trách"
                    dataIndex="institution"
                    key="institution"
                    render={
                        (ins) => ins.vn_name
                    }
                />
                {
                    (userRole == 1 || userRole == 2) ?

                        <Column
                            title="Thao tác"
                            key="action"
                            render={(text, record) => (
                                <Space size="small">
                                    {
                                        (
                                            checkIsModerator(record)
                                        ) ? <a>
                                            <Tag
                                                icon={<InfoCircleOutlined/>}
                                                color="#87d068"
                                                onClick={() => history.push(`/uet/courses/${record.uuid}/outlines`)}>
                                                Đề cương
                                            </Tag>
                                        </a> : <></>
                                    }
                                </Space>
                            )}
                        /> : <></>

                }

            </Table>
            <br/><br/>
            <Form
                {...{
                    labelCol: {span: 5},
                    wrapperCol: {span: 16},
                }}
                name="basic"
                initialValues={{remember: true}}
                onFinish={onAssignCourse}
            >
                <Form.Item
                    label="Chọn các học phần"
                    name="courses"
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Chọn các học phần giảng viên phụ trách"
                        defaultValue={employee.courses.map(course => course.uuid)}
                        filterOption={(input, option) =>

                            option.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0


                        }
                    >
                        {
                            courses.map((course, index) => {
                                return (
                                    <Select.Option key={course.uuid}>
                                        {course.course_code} - {course.course_name_vi}
                                    </Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item {...{
                    wrapperCol: {offset: 5, span: 16},
                }}>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>


        </>
    )
}

export default EmployeeAssignCourses;