import {CloudDownloadOutlined, DeleteOutlined, EyeOutlined, LoadingOutlined} from "@ant-design/icons";
import axios from "axios";
import Meta from "antd/lib/card/Meta";
import Paragraph from "antd/lib/typography/Paragraph";
import {Button, Card, List, message, Popconfirm, Tag, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions'
import Modal from "antd/es/modal/Modal";
import {useHistory} from "react-router-dom";

const FileDownload = require('js-file-download');

const DocumentCard = ({userRole, item, themeType}) => {
    const [editableTitle, setEditableTitle] = useState(item.name);
    const [editableDesc, setEditableDesc] = useState(item.description);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {loading} = useSelector(state => state.documents);
    const dispatch = useDispatch();
    const history = useHistory();

    const {trainingPrograms} = useSelector(state => state.trainingPrograms)
    const {courses} = useSelector(state => state.courses)

    const [downloading, setDownloading] = useState(false);

    function getDocumentResourceName() {
        let {resourceUuid, category} = item;
        if (category === "training-program") {
            let trainingItem = trainingPrograms.find(item => item.uuid === resourceUuid)
            if (trainingItem) {
                return trainingItem.vn_name
            }

        }
        if (category === "course") {
            let course = courses.find(item => item.uuid === resourceUuid)
            if (course)
                return course.course_name_vi
        }
        return "";
    }

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

    function onDownloadFile() {
        setDownloading(true);
        axios.get(`/documents/downloadOneFile/${item.document_url}`, {responseType: 'blob'})
            .then(res => {
                if (res.headers['content-type'] === 'application/pdf') {
                    FileDownload(res.data, 'document.pdf');
                } else if (res.headers['content-type'] === 'application/msword') {
                    FileDownload(res.data, 'document.doc');
                }
                setDownloading(false)
            })
            .catch((e) => {
                message.error(e.toString())
                setDownloading(false)
            })

    }

    function onRouteToResource() {
        if (item.category === 'training-program') {
            history.push(`/uet/training-programs/${item.resourceUuid}`);
        }
    }

    const ModalPreview = () => (
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
    )

    if (themeType === 1)
        return (
            <>
                <Card
                    hoverable
                    loading={loading}
                    title={
                        <Tooltip title={getDocumentResourceName()}>
                            <Tag color="#108ee9" onClick={onRouteToResource}>
                                {getDocumentResourceName()}
                            </Tag>
                        </Tooltip>
                    }
                    bodyStyle={{
                        padding: '0'
                    }}
                    actions={userRole < 2 ? [
                        !downloading
                            ? <CloudDownloadOutlined key="download" onClick={onDownloadFile}/>
                            : <LoadingOutlined key="downloading"/>,
                        <Popconfirm
                            title="Bạn muốn xóa tài liệu này?"
                            onConfirm={() => onConfirmDelete(item.uuid, item.category)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined key="delete"/>
                        </Popconfirm>

                    ] : (
                        !downloading
                            ? [<CloudDownloadOutlined key="download" onClick={onDownloadFile}/>]
                            : [<LoadingOutlined key="downloading"/>]

                    )}
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
                                userRole < 2 ?
                                    <Paragraph
                                        editable={{
                                            onChange: (e) => onUpdateTitleDoc(e),
                                        }}
                                        style={{margin: 0}}
                                    >{editableTitle}</Paragraph>
                                    : item.name
                            }
                            description={
                                userRole < 2 ?
                                    <Paragraph
                                        editable={{onChange: (e) => onUpdateDescDoc(e)}}
                                        style={{margin: 0}}
                                    >{editableDesc}</Paragraph>
                                    : (item.description || "")
                            }
                            style={{width: '100%', padding: '15px'}}
                        />
                    </div>
                </Card>
               <ModalPreview />
            </>
        )

    else
        return (
            <>
                <List.Item
                    style={{width: '100%'}}
                    actions={userRole < 2 ? [
                        <Button type="primary" shape="circle" icon={<EyeOutlined/>} size="middle" onClick={showModal}/>,
                        !downloading
                            ?
                            <CloudDownloadOutlined key="download" onClick={onDownloadFile} style={{fontSize: '22px'}}/>
                            : <LoadingOutlined key="downloading"/>,
                        <Popconfirm
                            title="Bạn muốn xóa tài liệu này?"
                            onConfirm={() => onConfirmDelete(item.uuid, item.category)}
                            okText="Xóa"
                            cancelText="Hủy"
                            placement="topRight"
                        >
                            <DeleteOutlined key="delete" style={{fontSize: '22px'}}/>
                        </Popconfirm>

                    ] : (

                        [
                            <Button type="primary" shape="circle" icon={<EyeOutlined/>} size="middle" onClick={showModal}/>,
                            !downloading
                                ? <CloudDownloadOutlined key="download" onClick={onDownloadFile}
                                                         style={{fontSize: '22px'}}/>
                                : <LoadingOutlined key="downloading"/>
                        ]
                    )}
                >
                    <List.Item.Meta
                        title={
                            userRole < 2 ?
                                <Paragraph
                                    editable={{
                                        onChange: (e) => onUpdateTitleDoc(e),
                                    }}
                                    style={{margin: 0}}
                                >{editableTitle}</Paragraph>
                                : item.name
                        }
                        description={
                            userRole < 2 ?
                                <Paragraph
                                    editable={{onChange: (e) => onUpdateDescDoc(e)}}
                                    style={{margin: 0}}
                                >{editableDesc}</Paragraph>
                                : (item.description || "")
                        }
                    />
                    <Tag color="geekblue" onClick={onRouteToResource}>
                        {getDocumentResourceName()}
                    </Tag>

                </List.Item>
                <ModalPreview />
            </>
        )
}

export default DocumentCard;