import {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import Cookies from "universal-cookie";
import {Button, message} from "antd";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import Dragger from "antd/es/upload/Dragger";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'

const cookies = new Cookies();
const user = cookies.get("account")
function DocumentPage () {
    const history = useHistory();
    const {type} = useParams();
    const dispatch = useDispatch();
    const {documents, loading} = useSelector(state => state.documents);

    const [isModalVisible, setIsModalVisible] = useState(false);

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
        multiple: true,
        action: 'http://localhost:9000/documents',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    return (
        <>
            {
                documents.map(doc => <img src={`data:image/png;base64, ${doc.document_url}`} alt="Red dot" />)
            }

            {user.role == 0 ? <Button
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
            <Modal title="Thêm mới tài liệu" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click hoặc kéo thả vào đây để upload file</p>
                    <p className="ant-upload-hint">
                        Hỗ trợ các loại file tài liệu pdf, doc, ...
                    </p>
                </Dragger>
            </Modal>
        </>
    )
}

export default DocumentPage
