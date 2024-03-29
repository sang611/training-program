import {PlusOutlined} from "@ant-design/icons";
import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    message,
    Modal,
    Pagination,
    Popconfirm,
    Radio,
    Row,
    Select,
    Space,
    Table
} from "antd";
import React, {useEffect, useMemo, useState} from 'react'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions"
import {Option} from "antd/lib/mentions";
import CreatePLO from "./CreatePLO";
import CreateCLO from "./CreateCLO";
import {locTypes} from "../../../constants";

const ListLocs = ({typeLoc, currentPage, onPaginateLOC, showModal}) => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.learningOutcomes);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: '80px',
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
                    <Button
                        type="primary"
                        onClick={() => showModal(record)}
                        icon={<i className="far fa-edit"/>}
                    >
                        &nbsp;Chỉnh sửa
                    </Button>
                    <Popconfirm title="Xóa CĐR này?" onConfirm={() => onDeleteLOC(record.uuid)}>
                        <Button danger type="primary" icon={<i className="far fa-trash-alt"/>}>
                            &nbsp;Xóa
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


    return <>
        <Table
            bordered
            pagination={false}
            loading={state.loading}
            columns={columns}
            dataSource={
                state.locs.map((loc, index) => {
                    loc.stt = (currentPage - 1) * 10 + index + 1;
                    loc.key = loc.uuid;
                    return loc;
                })
            }
        />
        <br/>
        <Row align="center">
            <Col>
                <Pagination
                    current={currentPage}
                    total={state.total}
                    onChange={
                        onPaginateLOC
                    }
                    showSizeChanger={false}
                />

            </Col>
        </Row>

    </>
}

const LearningOutcomePage = () => {
    const [visibleDrawer, setVisibleDrawer] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [editingLOC, setEditingLOC] = useState(null);
    const dispatch = useDispatch();

    const [typeLoc, setTypeLoc] = useState(1);
    const [content, setContent] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState(0);

    const [updateForm] = Form.useForm();

    function fetchLOC(params) {
        dispatch(actions.getAllLearningOutcomes(params))
    }

    useEffect(() => {
        fetchLOC({typeLoc, content, title, page: currentPage});
    }, [typeLoc, content, title, currentPage])

    useEffect(() => {
        updateForm.setFieldsValue(editingLOC)
    }, [editingLOC])

    const showDrawer = () => {
        setVisibleDrawer(true)
    };
    const onCloseDrawer = () => {
        setVisibleDrawer(false);
    };


    const onUpdateLOC = () => {
        updateForm
            .validateFields()
            .then((values) => {

                axios.put(`/learning-outcomes/${editingLOC.uuid}`, values)
                    .then((res) => {
                        message.success("Cập nhật CĐR thành công")
                        fetchLOC({typeLoc, content, title, page: currentPage});
                        updateForm.resetFields();
                        setVisibleModal(false);
                    })
                    .catch((e) => {
                        message.error("Đã có lỗi xảy ra")
                    })
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });


    };

    const showModal = (loc) => {
        setEditingLOC(loc);
        setVisibleModal(true)
    };
    const onHideModal = () => {
        setVisibleModal(false);
    }

    const onPaginateLOC = (page) => {
        setCurrentPage(page);
    }


    const onSearch = (e) => {
        let search = e.target.value;
        setContent(search);
        setCurrentPage(1)
    }

    const onFilterByTitle = (value) => {
        setTitle(value);
    }

    return (
        <>
            <div style={{paddingRight: '60px'}}>


                <Row justify="space-between">
                    <Col>
                        <Radio.Group value={typeLoc} onChange={(e) => setTypeLoc(e.target.value)} buttonStyle="solid">
                            <Radio.Button value={1}>Chương trình đào tạo</Radio.Button>
                            <Radio.Button value={2}>Học phần</Radio.Button>
                        </Radio.Group>
                    </Col>
                    <Col span={10}>
                        <Row>
                            <Col span={6}>
                                <Select
                                    onChange={onFilterByTitle}
                                    size="large"
                                    defaultValue={0}
                                    style={{width: '100%'}}
                                >
                                    <Option key='all' value={0}>Tất cả</Option>
                                    <Option key='kien_thuc' value={1}>Kiến thức</Option>
                                    <Option key='ki_nang' value={2}>Kĩ năng</Option>
                                    <Option key='dao_duc' value={3}>Thái độ</Option>
                                </Select>
                            </Col>
                            <Col span={18}>
                                <Input placeholder="Tìm kiếm theo nội dung" onChange={onSearch} style={{width: '100%'}}
                                       size="large"/>
                            </Col>


                        </Row>


                    </Col>
                </Row><br/>

                {
                    useMemo(() => {
                        return <ListLocs
                            typeLoc={typeLoc}
                            onPaginateLOC={onPaginateLOC}
                            currentPage={currentPage}
                            showModal={showModal}
                        />
                    }, [typeLoc, currentPage, content])
                }
            </div>
            <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined/>}
                size={"large"}
                danger
                style={{
                    position: 'fixed',
                    right: 40,
                    bottom: 32,
                }}
                onClick={() => {
                    showDrawer();
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
                            <Input.TextArea autoSize/>
                        </Form.Item>
                        <Form.Item name="title">
                            <Select
                                placeholder="Nhóm"
                            >
                                {
                                    locTypes.map(
                                        type =>
                                            <Select.Option
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.content}
                                            </Select.Option>
                                    )
                                }
                            </Select>
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
                    typeLoc === 1 ? <CreatePLO/> : <CreateCLO/>
                }

            </Drawer>
        </>
    )
}

export default LearningOutcomePage;
