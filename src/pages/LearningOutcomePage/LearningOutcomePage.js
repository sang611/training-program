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
import * as actions from "../../redux/actions/index"
import {Option} from "antd/lib/mentions";
import CreatePLO from "./CreatePLO";
import CreateCLO from "./CreateCLO";

const ListLocs = ({typeLoc, currentPage, onPaginateLOC, showModal}) => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.learningOutcomes);


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


    return <>
        <Table
            bordered
            pagination={false}
            loading={state.loading}
            columns={columns}
            dataSource={
                state.locs.map((loc, index) => {
                    loc.stt = index + 1;
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
                    }/>
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
                    <Radio.Group value={typeLoc} onChange={(e) => setTypeLoc(e.target.value)}>
                        <Radio value={1}>Chương trình đào tạo</Radio>
                        <Radio value={2}>Học phần</Radio>
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
                                <Option key='dao_duc' value={3}>Đạo đức</Option>
                            </Select>
                        </Col>
                        <Col span={18}>
                            <Input placeholder="Tìm kiếm" onChange={onSearch} style={{width: '100%'}} size="large"/>
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
                            <Input.TextArea/>
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
