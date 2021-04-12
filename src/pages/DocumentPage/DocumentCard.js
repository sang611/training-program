import {CloudDownloadOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import axios from "axios";
import Meta from "antd/lib/card/Meta";
import Paragraph from "antd/lib/typography/Paragraph";
import {Card, Divider, message, Popconfirm} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import * as actions from '../../redux/actions'
import Modal from "antd/es/modal/Modal";

const FileDownload = require('js-file-download');

const DocumentCard = ({userRole, item}) => {
    const [editableTitle, setEditableTitle] = useState(item.name);
    const [editableDesc, setEditableDesc] = useState(item.description);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setEditableDesc(item.description);
        setEditableTitle(item.name);
    }, [item])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    function onUpdateTitleDoc(val) {
        setEditableTitle(val)
        axios.put(`/documents/${item.uuid}`, {
            name: val,
        })
            .then(res => {
            })
            .catch((e) => {
                message.error("Không thể cập nhật");
            })
    }

    function onUpdateDescDoc(val) {
        setEditableDesc(val)
        axios.put(`/documents/${item.uuid}`, {
            description: val,
        })
            .then(res => {
            })
            .catch((e) => {
                message.error("Không thể cập nhật");
            })
    }

    function onConfirmDelete(uuid, category) {
        axios.delete(`/documents/${uuid}`)
            .then(res => {
                dispatch(actions.getAllDocuments({doc_of: category}));
                message.success("Đã xóa 1 tài liệu")
            })
            .catch(e => {
                message.error("Đã có lỗi xảy ra. Không thể xóa tài liệu")
            })
    }


    return (
        <>
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
                    //<EditOutlined key="edit"/>,
                    <Popconfirm
                        title="Bạn muốn xóa tài liệu này?"
                        onConfirm={()=>onConfirmDelete(item.uuid, item.category)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined key="delete"/>
                    </Popconfirm>

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
                        onClick={showModal}
                    />
                </center>

                <div>

                    <Meta
                        title={
                            userRole == 0 ?
                                <Paragraph
                                    editable={{
                                        onChange: (e) => onUpdateTitleDoc(e),
                                    }}
                                    style={{margin: 0}}
                                >{editableTitle}</Paragraph>
                                : item.name
                        }
                        description={
                            userRole == 0 ?
                                <Paragraph
                                    editable={{onChange: (e) =>  onUpdateDescDoc(e)}}
                                    style={{margin: 0}}
                                >{editableDesc}</Paragraph>
                                : (item.description || "")
                        }
                        style={{width: '100%', padding: '15px'}}
                    />
                </div>
            </Card>
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
                    src={`https://drive.google.com/file/d/${item.document_url}/preview`}
                    style={{
                        width: '100%',
                        height: '92vh'
                    }}
                />
            </Modal>
        </>
    )
}

export default DocumentCard;