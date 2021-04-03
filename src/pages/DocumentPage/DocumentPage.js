import {useState, useEffect, useMemo} from "react";
import {useHistory, useParams} from "react-router-dom";
import Cookies from "universal-cookie";
import {Button, Card, Form, Input, List, message} from "antd";
import {CloudDownloadOutlined, DeleteOutlined, EditOutlined, InboxOutlined, UploadOutlined} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import Dragger from "antd/es/upload/Dragger";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import axios from "axios";
import Meta from "antd/lib/card/Meta";
import Title from "antd/es/typography/Title";
const FileDownload = require('js-file-download');


function DocumentPage() {
    const history = useHistory();
    const {doc_of} = useParams();
    const dispatch = useDispatch();
    const {documents, loading} = useSelector(state => state.documents);
    const {userRole} = useSelector(state => state.auth);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(new FormData());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    const [previewDoc, setPreviewDoc] = useState(null);

    useEffect(() => {
        dispatch(actions.getAllDocuments({doc_of}));
        setPreviewDoc(null);
    }, [doc_of])

    useEffect(() => {
       if(previewDoc) {
           showModal();
       }
    }, [previewDoc])

    useEffect(() => {
        if(!isModalVisible) {

        }
    }, [isModalVisible])

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
        setUploadingDoc(true);
        axios.post("/documents", formData)
            .then((res) => {
                message.success(res.data.message);
                form.resetFields();
                documents.push(res.data.document)
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
                        <Input/>
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea/>
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


    return (
        <>
            <center>
                <Title level={2}>{
                    function (){
                        if(doc_of === 'training-program') return "Tài liệu chương trình đào tạo"
                        if(doc_of === 'course') return "Tài liệu học phần"
                        if(doc_of === 'learning-outcome') return "Tài liệu chuẩn đầu ra"
                        if(doc_of === 'involved') return "Các văn bản liên quan"
                    }()
                }</Title>
            </center>
            <br/>
            {
                useMemo(() => {
                    return (
                        <List
                            grid={{
                                gutter: 50,
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 4,
                                xxl: 4,
                            }}
                            dataSource={documents}
                            renderItem={item => (
                                <List.Item>
                                    <Card
                                        hoverable
                                        bodyStyle={{
                                            padding: '0'
                                        }}
                                        actions={userRole == 0 ? [
                                            <CloudDownloadOutlined key="download" onClick={() => {
                                                axios.get(`/documents/downloadOneFile/${item.document_url}`, {responseType: 'blob'})
                                                    .then(res => {
                                                        FileDownload(res.data, 'tmp.pdf');
                                                    })
                                            }}/>,
                                            <EditOutlined key="edit"/>,
                                            <DeleteOutlined key="delete"/>
                                        ] : [
                                            <CloudDownloadOutlined key="download" onClick={() => {
                                                axios.get(`/documents/downloadOneFile/${item.document_url}`, {responseType: 'blob'})
                                                    .then(res => {
                                                        FileDownload(res.data, 'tmp.pdf');
                                                    })
                                            }}/>
                                        ]}
                                    >
                                        <center>
                                            <img
                                                width='100%'
                                                height='250px'
                                                alt="Document"
                                                src={`https://drive.google.com/thumbnail?authuser=0&sz=w320&id=${item.document_url}`}
                                                onClick={() => {
                                                    setPreviewDoc(item);
                                                }}
                                            />
                                        </center>
                                        <div>

                                            <Meta
                                                title={item.name}
                                                description={item.description || "Không có mô tả"}
                                                style={{width: '100%', padding: '15px'}}
                                            />
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    )
                }, [documents])

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
                    setPreviewDoc(null);
                    showModal();
                }}
            /> : ""}
            {
                previewDoc ?
                    <Modal
                        visible={isModalVisible}
                        footer={null}
                        width='80%'
                        style={{top: 0}}
                        onCancel={() => {
                            handleCancel();
                        }
                        }
                    >
                        <iframe
                            src={`https://drive.google.com/file/d/${previewDoc.document_url}/preview`}
                            style={{
                                width: '100%',
                                height: '92vh'
                            }}
                        />
                    </Modal>
                    :
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

                    >
                        <FormUploadFile/>
                    </Modal>
            }

        </>
    )
}

export default DocumentPage
