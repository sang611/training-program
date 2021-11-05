import {PlusOutlined} from "@ant-design/icons";
import {Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";


const CourseClassList = ({CourseClass, loading, setVisibleModal, setEditedCourseClass, dispatch}) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            width: '60px'
        },
        {
            title: 'Tên lớp khóa học',
            dataIndex: 'name',
            key: "name"
        },
        {
            title: 'Mã lớp khóa học',
            dataIndex: 'code',
            key: 'code',
            width: '150px'
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
                                setEditedCourseClass(record);
                                setVisibleModal(true)
                            }}
                            >
                                Chỉnh sửa
                            </Button>
                            <Popconfirm
                                title="Xóa lớp khóa học này?"
                                onConfirm={
                                    () => {
                                        axios.delete(`/course-class/${record.uuid}`)
                                            .then((res) => {
                                                message.success(res.data.message)
                                                dispatch(actions.getAllCourseClass())
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
                dataSource={CourseClass.map((CourseClass, index) => {
                    CourseClass.stt = index + 1;
                    CourseClass.key = CourseClass.uuid;
                    return CourseClass
                })}
                bordered
                loading={loading}
                pagination={false}
            />
        </>
    )
}


const CourseClass = () => {
    const CourseClassModalForm = ({visible, onCancel, editedCourseClass, dispatch}) => {
        const [form] = Form.useForm();

        if (editedCourseClass) {
            form.setFieldsValue(editedCourseClass);
        }

        return (
            <Modal
                visible={visible}
                title={!editedCourseClass ? "Thêm mới lớp khóa học" : `Chỉnh sửa lớp khóa học ${editedCourseClass.vn_name}`}
                okText="Lưu"
                cancelText="Thoát"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            !editedCourseClass ?
                                axios.post(`/course-class`, values)
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllCourseClass());
                                    })
                                    .catch((e) => message.error(e.response.data.message))
                                :
                                axios.put(`/course-class/${editedCourseClass.uuid}`, values)
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllCourseClass());
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

                    <Form.Item label="Mã lớp khóa học:" name="code">
                        <Input placeholder="Nhập mã lớp khóa học"
                               addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                    <Form.Item label="Tên lớp khóa học:" name="name">
                        <Input placeholder="Tên lớp khóa học"
                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                </Form>
            </Modal>
        );
    };

    const [visibleModal, setVisibleModal] = useState(false);
    const dispatch = useDispatch();

    const {courseClasses, loadingAllCourseClasses} = useSelector(state => state.courseClass)
    const [editedCourseClass, setEditedCourseClass] = useState(null);

    useEffect(() => {
        dispatch(actions.getAllCourseClass());
    }, [])

    const onCancel = () => {
        setVisibleModal(false);
        setEditedCourseClass(null);
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
                loading={loadingAllCourseClasses}
            >
                <CourseClassList
                    CourseClass={courseClasses}
                    setVisibleModal={setVisibleModal}
                    setEditedCourseClass={setEditedCourseClass}
                    dispatch={dispatch}
                />
            </Card>
            <Row>
                <Col span={21}>

                </Col>
                <Col span={3}>

                </Col>
            </Row>


            <CourseClassModalForm
                visible={visibleModal}
                onCancel={onCancel}
                editedCourseClass={editedCourseClass}
                dispatch={dispatch}
            />
        </>
    )
}

export default CourseClass;