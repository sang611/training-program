import React, {useEffect, useMemo, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {Button, Col, Form, Input, List, message, Radio, Row, Select, Space, Spin} from "antd";
import {BlockOutlined, InboxOutlined, TableOutlined, UploadOutlined} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import Dragger from "antd/es/upload/Dragger";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions'
import axios from "axios";
import Title from "antd/es/typography/Title";
import DocumentCard from "./DocumentCard";
import Search from "antd/es/input/Search";


function DocumentPage() {
    const {doc_of} = useParams();
    const dispatch = useDispatch();
    const {documents, loading} = useSelector(state => state.documents);
    const {userRole} = useSelector(state => state.auth);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(new FormData());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);
    const [themeType, setThemeType] = useState(1);
    const {trainingPrograms} = useSelector(state => state.trainingPrograms)
    const {courses} = useSelector(state => state.courses)
    const {resourceUuid} = useParams();

    useEffect(() => {
        switch (doc_of) {
            case "training-program":
                dispatch(actions.getAllTrainingProgram());
                break;
            case "course":
                dispatch(actions.getAllCourse());
                break;
            default:
                break;
        }
    }, [])

    useEffect(() => {
        dispatch(actions.getAllDocuments(
            {doc_of, resourceUuid}
        ));
    }, [doc_of, resourceUuid])


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const props = {
        name: 'file',
        multiple: false,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        beforeUpload: (file) => {
            formData.set("file", file);
            return false;
        }
    };

    const onUploadFile = (values) => {
        formData.set("name", values.title)
        formData.set("description", values.description || "")
        formData.set("category", doc_of);
        formData.set("resourceUuid", values.resource)
        setUploadingDoc(true);
        axios.post("/documents", formData)
            .then((res) => {
                message.success(res.data.message);
                form.resetFields();
                dispatch(actions.getAllDocuments({doc_of}));
            })
            .catch((err) => {
                if (err.response) {
                    message.error(err.response.data.message)
                } else {
                    message.error("Đã xảy ra lỗi")
                }
            })
            .finally(() => {
                setUploadingDoc(false);
                handleOk();
            })
    }

    const ResourceInput = () => {
        if (doc_of === "training-program") {
            return (
                <Select
                    placeholder={`Chọn 1 chương trình đào tạo`}
                >
                    {
                        trainingPrograms.map((item) => {
                            return <Select.Option value={item.uuid} key={item.uuid}>{item.vn_name}</Select.Option>
                        })
                    }
                </Select>
            )
        }
        if (doc_of === "course") {
            return (
                <Select
                    placeholder={`Chọn 1 học phần`}
                >
                    {
                        courses.map((item) => {
                            return <Select.Option value={item.uuid}
                                                  key={item.uuid}>{`${item.course_name_vi}-${item.course_code}`}</Select.Option>
                        })
                    }
                </Select>
            )
        }

    }

    const RenderLabel = () => {
        if (doc_of === "training-program") return "Chương trình đào tạo";
        if (doc_of === "course") return "Học phần";
    }

    const FormUploadFile = () => {
        return (
            <>
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        modifier: 'public',
                    }}
                    onFinish={onUploadFile}
                >
                    <Form.Item
                        name="title"
                        label="Tên tài liệu"
                        rules={[
                            {
                                required: true,
                                message: 'Nhập tên tài liệu!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tiêu đề tài liệu"/>
                    </Form.Item>
                    {
                        doc_of === "involved" ? '' :
                            <Form.Item
                                name="resource"
                                label={RenderLabel()}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn 1 chương trình đào tạo!',
                                    },
                                ]}
                            >
                                {
                                    ResourceInput()
                                }
                            </Form.Item>
                    }

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea placeholder="Mô tả ngắn gọn về tài liệu"/>
                    </Form.Item>

                    <Form.Item name="file" label="Upload tài liệu">
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click hoặc kéo thả vào đây để upload file</p>
                            <p className="ant-upload-hint">
                                Hỗ trợ các loại file tài liệu pdf, doc, ...
                            </p>
                        </Dragger>
                    </Form.Item>

                </Form>
            </>
        )
    }

    const onSearch = (e) => {
        dispatch(actions.getAllDocuments({
            doc_of: doc_of,
            title: e.target.value,
            resourceUuid: resourceUuid || ""
        }));
    }

    const BlockTheme = () => {
        return (
            <List
                grid={userRole < 2 ? {
                    gutter: [50, 30],
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                } : {
                    gutter: [50, 30],
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 5,
                    xxl: 5,
                }
                }
                dataSource={documents}
                renderItem={item => (
                    <List.Item>
                        <DocumentCard userRole={userRole} item={item} themeType={themeType}/>
                    </List.Item>
                )}
            />
        )
    }

    const ListTheme = () => {
        return (
            <>
                <List
                    dataSource={documents}
                    itemLayout="horizontal"
                    renderItem={item => (
                        <List.Item>
                            <DocumentCard userRole={userRole} item={item} themeType={themeType}/>
                        </List.Item>
                    )}
                >

                </List>
            </>
        )
    }

    return (
        <>
            <Row>
                <Col span={12}>
                    <Space size="middle">
                        <Title level={3}>{
                            function () {
                                if (doc_of === 'training-program') return "Tài liệu chương trình đào tạo"
                                else if (doc_of === 'course') return "Tài liệu học phần"
                                else if (doc_of === 'involved') return "Các văn bản liên quan"
                            }()
                        }
                        </Title>

                        <Radio.Group
                            defaultValue={themeType}
                            buttonStyle="solid"
                            onChange={(e) => setThemeType(e.target.value)}
                        >
                            <Radio.Button value={1}>
                                <BlockOutlined/>
                            </Radio.Button>
                            <Radio.Button value={2}>
                                <TableOutlined/>
                            </Radio.Button>

                        </Radio.Group>
                    </Space>


                </Col>
                <Col span={12}>
                    <Search placeholder="Tìm kiếm tài liệu" onChange={onSearch} enterButton/>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={22}>
                    {
                        useMemo(() => {
                            return loading ? <Spin/> : (
                                themeType === 1 ? <BlockTheme /> : <ListTheme />
                            )
                        }, [documents, loading, themeType])

                    }
                </Col>
                <Col span={2}>
                    {userRole < 2 ? <Button
                        type="primary"
                        shape="circle"
                        danger
                        icon={<UploadOutlined/>}
                        size={"large"}
                        style={{
                            position: 'fixed',
                            right: 52,
                            bottom: 32
                        }}
                        onClick={() => {
                            showModal();
                        }}
                    /> : ""}
                </Col>
            </Row>

            <Modal
                title={"Thêm mới tài liệu"}
                visible={isModalVisible}
                confirmLoading={uploadingDoc}
                onOk={
                    () => {
                        form
                            .validateFields()
                            .then((values) => {
                                onUploadFile(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }
                }
                onCancel={handleCancel}
                style={{top: '20px'}}
            >
                <FormUploadFile/>
            </Modal>


        </>
    )
}

export default DocumentPage
