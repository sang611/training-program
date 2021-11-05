import {PlusOutlined} from "@ant-design/icons";
import {Button, Card, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";

const MajorsList = ({majors, loading, setVisibleModal, setEditedMajor, dispatch}) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            width: '60px'
        },
        {
            title: 'Tên ngành',
            children: [
                {
                    title: 'Tiếng Việt',
                    dataIndex: 'vn_name',
                    key: 'vn_name'
                },
                {
                    title: 'Tiếng Anh',
                    dataIndex: 'en_name',
                    key: 'en_name'
                }
            ]
        },
        {
            title: 'Mã ngành',
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
                                setEditedMajor(record);
                                setVisibleModal(true)
                            }}
                            >
                                Chỉnh sửa
                            </Button>
                            <Popconfirm
                                title="Xóa ngành này?"
                                onConfirm={
                                    () => {
                                        axios.delete(`/majors/${record.uuid}`)
                                            .then((res) => {
                                                message.success(res.data.message)
                                                dispatch(actions.getAllMajor())
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
                dataSource={majors.map((major, index) => {
                    major.stt = index + 1;
                    major.key = major.uuid;
                    return major
                })}
                bordered
                loading={loading}
                pagination={false}
            />
        </>
    )
}


const MajorPage = () => {
    const MajorModalForm = ({visible, onCancel, editedMajor, dispatch}) => {
        const [form] = Form.useForm();

        if (editedMajor) {
            form.setFieldsValue(editedMajor);
        }

        return (
            <Modal
                visible={visible}
                title={!editedMajor ? "Thêm mới ngành" : `Chỉnh sửa ngành ${editedMajor.vn_name}`}
                okText="Lưu"
                cancelText="Thoát"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            !editedMajor ?
                                axios.post(`/majors`, values)
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllMajor());
                                    })
                                    .catch((e) => message.error(e.response.data.message))
                                :
                                axios.put(`/majors/${editedMajor.uuid}`, values)
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllMajor());
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
                    <Form.Item label="Tên ngành (VI):" name="vn_name">
                        <Input placeholder="Tên ngành bằng Tiếng Việt"
                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>
                    <Form.Item label="Tên ngành (EN):" name="en_name">
                        <Input placeholder="Tên ngành bằng Tiếng Anh"
                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                    <Form.Item label="Mã ngành:" name="code">
                        <Input placeholder="Nhập mã ngành"
                               addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                    <Form.Item label="Bậc:" name="level">
                        <Input placeholder="Bậc của ngành"
                               addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                </Form>
            </Modal>
        );
    };

    const [visibleModal, setVisibleModal] = useState(false);
    const dispatch = useDispatch();
    const {majors, loadingAllMajor} = useSelector(state => state.majors)
    const [editedMajor, setEditedMajor] = useState(null);

    useEffect(() => {
        dispatch(actions.getAllMajor());
    }, [])

    const onCancel = () => {
        setVisibleModal(false);
        setEditedMajor(null);
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
                loading={loadingAllMajor}
            >
                <MajorsList
                    majors={majors}

                    setVisibleModal={setVisibleModal}
                    setEditedMajor={setEditedMajor}
                    dispatch={dispatch}
                />
            </Card>


            <MajorModalForm
                visible={visibleModal}
                onCancel={onCancel}
                editedMajor={editedMajor}
                dispatch={dispatch}
            />
        </>
    )
}

export default MajorPage;