import {useEffect, useMemo, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {Button, Col, Form, Input, List, message, Row, Select, Spin} from "antd";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import Dragger from "antd/es/upload/Dragger";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
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

    const {trainingPrograms} = useSelector(state => state.trainingPrograms)
    const {courses} = useSelector(state => state.courses)

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
        dispatch(actions.getAllDocuments({doc_of}));
    }, [doc_of])


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
        if(doc_of === "training-program") {
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
        if(doc_of === "course") {
            return (
                <Select
                    placeholder={`Chọn 1 học phần`}
                >
                    {
                        courses.map((item) => {
                            return <Select.Option value={item.uuid} key={item.uuid}>{`${item.course_name_vi}-${item.course_code}`}</Select.Option>
                        })
                    }
                </Select>
            )
        }

    }

    const RenderLabel = () => {
        if(doc_of === "training-program") return "Chương trình đào tạo"
        if(doc_of === "course") return "Học phần"
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
        dispatch(actions.getAllDocuments({doc_of: doc_of, title: e.target.value}));
    }


    return (
        <>
            <Row>
                <Col span={12}>
                    <Title level={3}>{
                        function () {
                            if (doc_of === 'training-program') return "Tài liệu chương trình đào tạo"
                            if (doc_of === 'course') return "Tài liệu học phần"
                            if (doc_of === 'learning-outcome') return "Tài liệu chuẩn đầu ra"
                            if (doc_of === 'involved') return "Các văn bản liên quan"
                        }()
                    }</Title>
                </Col>
                <Col span={12}>
                    <Search placeholder="Tìm kiếm tài liệu" onChange={onSearch} enterButton/>
                </Col>
            </Row>
            <br/>
            {
                useMemo(() => {
                    return loading ? <Spin /> : (
                        <List
                            grid={userRole == 0 ? {
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
                                    <DocumentCard userRole={userRole} item={item}/>
                                </List.Item>
                            )}
                        />
                    )
                }, [documents, loading])

            }

            {userRole == 0 ? <Button
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
