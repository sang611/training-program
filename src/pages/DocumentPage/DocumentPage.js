import {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import Cookies from "universal-cookie";
import {Button, Form, Input, message} from "antd";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import Dragger from "antd/es/upload/Dragger";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import axios from "axios";


function DocumentPage () {
    const history = useHistory();
    const {type} = useParams();
    const dispatch = useDispatch();
    const {documents, loading} = useSelector(state => state.documents);
    const {userRole} = useSelector(state => state.auth);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState(new FormData());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    useEffect(() => {
        dispatch(actions.getAllDocuments());
    }, [])

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
        formData.set("description", values.description)
        setUploadingDoc(true);
        axios.post("/documents", formData)
            .then((res) => {
                message.success(res.data.message);
                documents.push(res.data.document)
                setUploadingDoc(false);
            })
            .catch((err) => {
                message.error(err.response.data.message)
            })
            .finally(() => {
                handleOk();

            })
    }

    return (
        <>
            {
                documents.map(doc => {
                    return <iframe src={`https://drive.google.com/file/d/${doc.document_url}/preview`} width="100%" height="100vh"/>
                })
            }

            {userRole == 0 ? <Button
                type="primary"
                shape="circle"
                danger
                icon={<UploadOutlined />}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 32
                }}
                onClick={showModal}
            /> : ""}
            <Modal
                title="Thêm mới tài liệu"
                visible={isModalVisible}
                confirmLoading={uploadingDoc}
                onOk={
                    () => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onUploadFile(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }
                }
                onCancel={handleCancel}
            >

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
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="file" label="Upload tài liệu">
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click hoặc kéo thả vào đây để upload file</p>
                            <p className="ant-upload-hint">
                                Hỗ trợ các loại file tài liệu pdf, doc, ...
                            </p>
                        </Dragger>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}

export default DocumentPage
