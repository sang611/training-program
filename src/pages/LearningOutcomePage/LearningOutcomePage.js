import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Col, Drawer, Form, Input, message, Modal, Popconfirm, Radio, Row, Select, Space, Table} from "antd";
import React, {useEffect, useState, useMemo} from 'react'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions/index"
import {Option} from "antd/lib/mentions";
import Search from "antd/lib/input/Search";

const CreateCLO = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [locs, setLocs] = useState([]);
    const [plos, setPlos] = useState([]);
    useEffect(() => {
        axios.get("/learning-outcomes/1")
            .then((res) => setLocs(res.data.learningOutcomes))
    }, [])

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: {span: 24, offset: 0},
            sm: {span: 20, offset: 0},
        },
    };
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 20},
        },
    };

    const onFinish = ({contents}) => {
        const data = {
            contents: contents,
            category: 2,
            plos: plos
        }
        axios.post("/learning-outcomes", data)
            .then((res) => {
                message.success("CĐR được thêm thành công")
                dispatch(actions.getAllLearningOutcomes({typeLoc: 2}))
            })
            .catch((e) => message.error("Đã có lỗi xảy ra"))
        form.resetFields();
    };

    function handleChange(value) {
        setPlos(value);
    }

    return (
        <>
            <Select
                mode="multiple"
                allowClear
                size={"middle"}
                style={{ width: '100%' }}
                placeholder="Chọn các CĐR CTĐT có liên quan"
                onChange={handleChange}
            >
                {
                    locs.map((loc) => {
                        return (
                            <Option key={loc.uuid}>{loc.content}</Option>
                        )
                    })
                }

            </Select><br/><br/>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.List
                    name="contents"
                    rules={[{required: true, message: 'Tạo ít nhất 1 nội dung CĐR'}]}
                >
                    {(fields, {add, remove}, {errors}) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    /*label={index === 0 ? 'Nội dung' : ''}*/
                                    required={true}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Nhập nội dung CĐR",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Row>
                                            <Col span={22}>
                                                <Input.TextArea placeholder="Mô tả"
                                                                style={{width: '100%'}}/>
                                            </Col>
                                            <Col span={2}>

                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)}
                                                />

                                            </Col>

                                        </Row>

                                    </Form.Item>

                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    block
                                    onClick={() => add()}
                                    icon={<PlusOutlined/>}
                                >
                                    Thêm CĐR
                                </Button>
                                <Form.ErrorList errors={errors}/>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

const LearningOutcomePage = () => {
    const [visibleDrawer, setVisibleDrawer] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [editingLOC, setEditingLOC] = useState(null);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [parentOutcome, setParentOutcome] = useState(null);

    useEffect(() => {
        updateForm.setFieldsValue(editingLOC)
    }, [editingLOC])

    const showDrawer = () => {
        setVisibleDrawer(true)
    };
    const onCloseDrawer = () => {
        setVisibleDrawer(false);
    };

    const showModal = (loc) => {
        setEditingLOC(loc);
        setVisibleModal(true)
    };


    const onUpdateLOC = () => {
        updateForm
            .validateFields()
            .then((values) => {
                updateForm.resetFields();
                updateLOC(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });

        const updateLOC = (values) => {
            axios.put(`/learning-outcomes/${editingLOC.uuid}`, values)
                .then((res) => {
                    message.success("Cập nhật CĐR thành công")
                    dispatch(actions.getAllLearningOutcomes(typeLoc));
                    setVisibleModal(false);
                })
                .catch((e) => {
                    message.error("Đã có lỗi xảy ra")
                })
        }
    };

    const onHideModal = () => {
        setVisibleModal(false);
    }

    const onCreateChildLOC = (parentLOC) => {
        setParentOutcome(parentLOC);
        showDrawer()
    }

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: {span: 24, offset: 0},
            sm: {span: 20, offset: 0},
        },
    };
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 20},
        },
    };

    const ListLocs = () => {
        const state = useSelector(state => state.learningOutcomes);
        useEffect(() => {
            dispatch(actions.getAllLearningOutcomes({typeLoc}));
        },[])
        useEffect(() => {
            state.locs.map((loc, index) => {
                loc.stt = index + 1;
                return loc;
            })
        }, [state])
        const columns = [
            {
                title: 'STT',
                dataIndex: 'stt',
                key: 'stt',
                width: '80px',
                render: text => text,
            },
            {
                title: 'Chuẩn đầu ra',
                dataIndex: 'content',
                //ellipsis: true,
                key: 'content',

            },
            {
                title: 'Thao tác',
                dataIndex: 'action',
                width: '200px',
                render: (_, record) =>
                    <Space size="middle">
                        <Button type="primary" onClick={() => showModal(record)}>Chỉnh sửa</Button>
                        <Popconfirm title="Xóa CĐR này?" onConfirm={() => onDeleteLOC(record.uuid)}>
                            <Button danger type="primary">
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>


            },
        ];
        const onDeleteLOC = (id) => {
            axios.delete(`/learning-outcomes/${id}`)
                .then((res) => {
                    message.success("Xóa CĐR thành công")

                })
                .then(() => dispatch(actions.getAllLearningOutcomes({typeLoc})))
                .catch((e) => {
                    message.error("Đã có lỗi xảy ra")
                })
        }
        const onSearch = (value) => {
            dispatch(actions.getAllLearningOutcomes({typeLoc, content: value.target.value}))
        }
        return <>
            <Table
                bordered
                loading={state.loading}
                pagination={false}
                columns={columns}
                dataSource={
                    state.locs.map((loc, index) => {
                        loc.stt = index + 1;
                        return loc;
                    })
                }
                footer={() => {
                        return (
                            <>
                                <Row>
                                    <Col span={17} offset={2}>
                                        <Search placeholder="Tìm kiếm"  style={{ width: '100%'}} onChange={onSearch} />
                                    </Col>
                                </Row>

                            </>
                        )
                    }
                }
            />
        </>
    }

    const [typeLoc, setTypeLoc] = useState(1);

    const CreatePLO = () => {
        const onFinish = ({contents}) => {
            const data = {
                contents: contents,
                parent_uuid: parentOutcome ? parentOutcome.uuid : null,
                category: typeLoc,
                order: parentOutcome ? parentOutcome.order+1 : 1
            }
            axios.post("/learning-outcomes", data)
                .then((res) => {
                    message.success("CĐR được thêm thành công")

                    dispatch(actions.getAllLearningOutcomes({typeLoc}))
                })
                .catch((e) => message.error("Đã có lỗi xảy ra"))
            form.resetFields();
        };
        return (
            <>
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                    <Form.List
                        name="contents"
                        rules={[{required: true, message: 'Tạo ít nhất 1 nội dung CĐR'}]}
                    >
                        {(fields, {add, remove}, {errors}) => (
                            <>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                        /*label={index === 0 ? 'Nội dung' : ''}*/
                                        required={true}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: "Nhập nội dung CĐR",
                                                },
                                            ]}
                                            noStyle
                                        >
                                            <Row>
                                                <Col span={22}>
                                                    <Input.TextArea placeholder="Mô tả"
                                                                    style={{width: '100%'}}/>
                                                </Col>
                                                <Col span={2}>

                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => remove(field.name)}
                                                    />

                                                </Col>

                                            </Row>

                                        </Form.Item>

                                    </Form.Item>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        block
                                        onClick={() => add()}
                                        icon={<PlusOutlined/>}
                                    >
                                        Thêm CĐR
                                    </Button>
                                    <Form.ErrorList errors={errors}/>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }




    return (
        <>
            <Radio.Group value={typeLoc} onChange={(e) => setTypeLoc(e.target.value)}>
                <Radio value={1}>Chương trình đào tạo</Radio>
                <Radio value={2}>Học phần</Radio>
            </Radio.Group><br/><br/>
            {
                useMemo(() => {
                    return  <ListLocs />
                }, [typeLoc])
            }

            <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined/>}
                size={"large"}
                danger
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 32,
                }}
                onClick={()=> {
                    showDrawer();
                    setParentOutcome(null)
                }}
            />
            {
                <Modal
                    title="Cập nhật chuẩn đầu ra"
                    visible={visibleModal}
                    onOk={onUpdateLOC}
                    onCancel={onHideModal}
                    okText="Cập nhật"
                    cancelText="Thoát"
                >
                    <Form form={updateForm} layout="vertical" name="form_in_modal">
                        <Form.Item
                            name="content"
                            label="Chuẩn đầu ra"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập nội dung muốn cập nhật!',
                                },
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Modal>
            }
            <Drawer
                title={`Tạo mới chuẩn đầu ra ${typeLoc === 1 ? "chương trình đào tạo" : "học phần"}`}
                width={720}
                onClose={onCloseDrawer}
                visible={visibleDrawer}
                bodyStyle={{paddingBottom: 80}}
            >
                {
                    typeLoc === 1 ? <CreatePLO /> : <CreateCLO />
                }

            </Drawer>
        </>
    )
}

export default LearningOutcomePage;