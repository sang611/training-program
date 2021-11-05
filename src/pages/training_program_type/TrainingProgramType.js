import {PlusOutlined} from "@ant-design/icons";
import {Button, Card, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";

const TrainingTypesList = ({TrainingTypes, loading, setVisibleModal, setEditedTrainingType, dispatch}) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            width: '60px'
        },
        {
            title: 'Tên hệ đào tạo',
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
            title: 'Mã hệ đào tạo',
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
                                setEditedTrainingType(record);
                                setVisibleModal(true)
                            }}
                            >
                                Chỉnh sửa
                            </Button>
                            <Popconfirm
                                title="Xóa hệ đào tạo này?"
                                onConfirm={
                                    () => {
                                        axios.delete(`/training-program-types/${record.uuid}`)
                                            .then((res) => {
                                                message.success(res.data.message)
                                                dispatch(actions.getAllTrainingType())
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
                dataSource={TrainingTypes.map((TrainingType, index) => {
                    TrainingType.stt = index + 1;
                    TrainingType.key = TrainingType.uuid;
                    return TrainingType
                })}
                bordered
                loading={loading}
                pagination={false}
            />
        </>
    )
}


const TrainingProgramType = () => {
    const TrainingTypeModalForm = ({visible, onCancel, editedTrainingType, dispatch}) => {
        const [form] = Form.useForm();

        if (editedTrainingType) {
            form.setFieldsValue(editedTrainingType);
        }

        return (
            <Modal
                visible={visible}
                title={!editedTrainingType ? "Thêm mới hệ đào tạo" : `Chỉnh sửa hệ đào tạo ${editedTrainingType.vn_name}`}
                okText="Lưu"
                cancelText="Thoát"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            !editedTrainingType ?
                                axios.post(`/training-program-types`, values)
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllTrainingType());
                                    })
                                    .catch((e) => message.error(e.response.data.message))
                                :
                                axios.put(`/training-program-types/${editedTrainingType.uuid}`, values)
                                    .then((res) => {
                                        message.success(res.data.message)
                                        dispatch(actions.getAllTrainingType());
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
                    <Form.Item label="Tên hệ đào tạo (VI):" name="vn_name">
                        <Input placeholder="Tên hệ đào tạo bằng Tiếng Việt"
                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>
                    <Form.Item label="Tên hệ đào tạo (EN):" name="en_name">
                        <Input placeholder="Tên hệ đào tạo bằng Tiếng Anh"
                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                    <Form.Item label="Mã hệ đào tạo:" name="code">
                        <Input placeholder="Nhập mã hệ đào tạo"
                               addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                    </Form.Item>

                </Form>
            </Modal>
        );
    };

    const [visibleModal, setVisibleModal] = useState(false);
    const dispatch = useDispatch();

    const {trainingProgramTypes, loadingAllTrainingTypes} = useSelector(state => state.trainingTypes)
    const [editedTrainingType, setEditedTrainingType] = useState(null);

    useEffect(() => {
        dispatch(actions.getAllTrainingType());
    }, [])

    const onCancel = () => {
        setVisibleModal(false);
        setEditedTrainingType(null);
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
                loading={loadingAllTrainingTypes}
            >
                <TrainingTypesList
                    TrainingTypes={trainingProgramTypes}
                    setVisibleModal={setVisibleModal}
                    setEditedTrainingType={setEditedTrainingType}
                    dispatch={dispatch}
                />
            </Card>
            <TrainingTypeModalForm
                visible={visibleModal}
                onCancel={onCancel}
                editedTrainingType={editedTrainingType}
                dispatch={dispatch}
            />
        </>
    )
}

export default TrainingProgramType;