import {PlusOutlined} from "@ant-design/icons";
import {Button, Card, Col, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import moment from "moment";


const CourseYearList = ({CourseYear, loading, setVisibleModal, setEditedCourseYear, dispatch}) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            width: '60px'
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: "name"
        },
        {
            title: 'Mã khóa học',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Năm bắt đầu',
            dataIndex: 'fromYear',
            key: 'fomYear',
        },
        {
            title: 'Năm kết thúc',
            dataIndex: 'toYear',
            key: 'toYear',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: '200px',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <Button type="primary" onClick={() => {
                                setEditedCourseYear(record);
                                setVisibleModal(true)
                            }}
                            >
                                Chỉnh sửa
                            </Button>
                            <Popconfirm
                                title="Xóa khóa học này?"
                                onConfirm={
                                    () => {
                                        axios.delete(`/course-years/${record.uuid}`)
                                            .then((res) => {
                                                message.success(res.data.message)
                                                dispatch(actions.getAllCourseYear())
                                            })
                                            .catch(e => message.error(e.response.data.message))
                                    }
                                }

                                okText="Xóa"
                                cancelText="Thoát"
                            >
                                <Button type="primary" danger>Xóa</Button>
                            </Popconfirm>

                        </Space>
                    </>
                )
            }
        }
    ]
    return (
        <>
            <Table
                columns={columns}
                dataSource={CourseYear.map((CourseYear, index) => {
                    CourseYear.stt = index + 1;
                    CourseYear.key = CourseYear.uuid;
                    return CourseYear
                })}
                bordered
                loading={loading}
                pagination={false}
            />
        </>
    )
}


const CourseYear = () => {
    const CourseYearModalForm = ({visible, onCancel, editedCourseYear, dispatch}) => {
        const [form] = Form.useForm();

        if (editedCourseYear) {
            form.setFieldsValue(editedCourseYear);
            form.setFieldsValue({
                time: [moment(editedCourseYear.fromYear), moment(editedCourseYear.toYear)]
            })
        }

        return (
            <Modal
                visible={visible}
                title={!editedCourseYear ? "Thêm mới khóa học" : `Chỉnh sửa khóa học ${editedCourseYear.vn_name}`}
                okText="Lưu"
                cancelText="Thoát"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            console.log(values.time[0].format())
                            !editedCourseYear ?
                                axios.post(`/course-years`, {
                                    ...values,
                                    fromYear: values.time[0].format().toString().slice(0, 4),
                                    toYear: values.time[1].format().toString().slice(0, 4)
                                })
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllCourseYear());
                                    })
                                    .catch((e) => message.error(e.response.data.message))
                                :
                                axios.put(`/course-years/${editedCourseYear.uuid}`, {
                                    ...values,
                                    fromYear: values.time[0].format().toString().slice(0, 4),
                                    toYear: values.time[1].format().toString().slice(0, 4)
                                })
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllCourseYear());
                                    })
                                    .catch((e) => message.error(e.response.data.message))


                        })
                        .then(() => {
                            form.resetFields();
                            //dispatch(actions.getAllCourse())
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

                    <Form.Item label="Mã khóa học:" name="code">
                        <Input placeholder="Nhập mã khóa học"
                               addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                    <Form.Item label="Tên khóa học:" name="name">
                        <Input placeholder="Tên khóa học"
                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                    <Form.Item label="Thời gian:" name="time">
                        <DatePicker.RangePicker picker="year"/>
                    </Form.Item>


                </Form>
            </Modal>
        );
    };

    const [visibleModal, setVisibleModal] = useState(false);
    const dispatch = useDispatch();

    const {courseYears, loadingAllCourseYears} = useSelector(state => state.courseYear)
    const [editedCourseYear, setEditedCourseYear] = useState(null);

    useEffect(() => {
        dispatch(actions.getAllCourseYear());
    }, [])

    const onCancel = () => {
        setVisibleModal(false);
        setEditedCourseYear(null);
    }
    return (
        <>
            <Card
                title="Danh sách khóa học"
                extra={
                    <Button
                        type="primary"
                        shape="circle"
                        danger
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setVisibleModal(true);
                        }}
                    />
                }
                loading={loadingAllCourseYears}
            >
                <CourseYearList
                    CourseYear={courseYears}

                    setVisibleModal={setVisibleModal}
                    setEditedCourseYear={setEditedCourseYear}
                    dispatch={dispatch}
                />
            </Card>

            <CourseYearModalForm
                visible={visibleModal}
                onCancel={onCancel}
                editedCourseYear={editedCourseYear}
                dispatch={dispatch}
            />
        </>
    )
}

export default CourseYear;