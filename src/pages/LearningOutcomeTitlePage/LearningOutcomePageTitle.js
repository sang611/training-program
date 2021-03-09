import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Col, Drawer, Form, Input, message, Modal, Popconfirm, Radio, Row, Select, Space, Table} from "antd";
import React, {useEffect, useState, useMemo} from 'react'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions/index"

const LearningOutcomeTitlePage = () => {
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
            axios.put(`/learning-outcome-titles/${editingLOC.uuid}`, values)
                .then((res) => {
                    message.success("Cập nhật danh mục thành công")
                    dispatch(actions.getAllLearningOutcomeTitles(typeLoc));
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
        const [locs, setLocs] = useState([]);
        const state = useSelector(state => state.learningOutcomeTitles);
        useEffect(() => {
            dispatch(actions.getAllLearningOutcomeTitles(typeLoc));
        },[])
        useEffect(() => {
            state.locTitles.forEach((loc) => {
                loc.key = loc.uuid;
                if (loc.children && loc.children.length > 0) {
                    loc.children.forEach((child) => {
                        child.children = [];
                        child.key = child.uuid
                        for (let oc of state.locTitles) {
                            if (child.uuid === oc.parent_uuid) {
                                child.children.push(oc);
                            }
                        }
                        if (child.children.length === 0) delete child.children;
                    })
                } else {
                    delete loc.children;
                }
            })

            setLocs(
                state.locTitles.filter((loc) => {
                    return loc.parent_uuid == null;
                })
            );
        }, [state])
        const columns = [
            {
                title: 'Nội dung',
                dataIndex: 'content',
                ellipsis: true,
                key: 'content',

            },
            {
                title: 'Thao tác',
                dataIndex: 'action',
                width: '200px',
                render: (_, record) =>
                    <Space size="middle">
                        {record.order <= 3 ? <a onClick={() => onCreateChildLOC(record)}>Thêm</a> : ""}

                        <a onClick={() => showModal(record)}>Chỉnh sửa</a>

                        <Popconfirm title="Xóa CĐR này?" onConfirm={() => onDeleteLOC(record.uuid)}>
                            <a>Xóa</a>
                        </Popconfirm>
                    </Space>


            },
        ];
        const onDeleteLOC = (id) => {
            axios.delete(`/learning-outcome-titles/${id}`)
                .then((res) => {
                    message.success("Xóa CĐR thành công")

                })
                .then(() => dispatch(actions.getAllLearningOutcomeTitles(typeLoc)))
                .catch((e) => {
                    message.error("Đã có lỗi xảy ra")
                })
        }
        return <>
            <Table
                loading={state.loading}
                pagination={false}
                columns={columns}
                dataSource={locs}
                expandable={{indentSize: 40}}
            />
        </>
    }

    const CreateLOC = () => {
        const onFinish = ({contents}) => {
            const data = {
                contents: contents,
                parent_uuid: parentOutcome ? parentOutcome.uuid : null,
                category: typeLoc,
                order: parentOutcome ? parentOutcome.order+1 : 1
            }
            axios.post("/learning-outcome-titles", data)
                .then((res) => {
                    message.success("CĐR được thêm thành công")
                    dispatch(actions.getAllLearningOutcomeTitles(typeLoc))
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

    const [typeLoc, setTypeLoc] = useState(1);

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
                danger
                icon={<PlusOutlined/>}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 32
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
                            label="Nội dung"
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
                title={`Thêm mới chuẩn đầu ra: ${parentOutcome ? parentOutcome.content : ""}`}
                width={720}
                onClose={onCloseDrawer}
                visible={visibleDrawer}
                bodyStyle={{paddingBottom: 80}}
            >

                <CreateLOC />
            </Drawer>
        </>
    )
}

export default LearningOutcomeTitlePage;