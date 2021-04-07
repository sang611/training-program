import {Button, Descriptions, Drawer, Image, message, Popconfirm, Space, Spin, Table, Tag} from 'antd';
import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions/institutions'
import axios from "axios";
import {AppstoreAddOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import CreateInstitutionPage from "../CreateInstitutionPage";
import { io } from "socket.io-client";



const ListInstitutionPage = () => {
    const [visible, setVisible] = useState(false);
    const [visibleDrawerCreate, setVisibleDrawerCreate] = useState(false);
    const [ins, setIns] = useState({});
    const [parentIns, setParentIns] = useState(null);
    const dispatch = useDispatch();

    const {loading, listInstitutions, createSuccess} = useSelector(state => state.institutions)



    const onDeleteIns = async (id) => {
        await axios.delete(`/institutions/${id}`)
            .then(() => {
                dispatch(actions.getAllInstitution());
                message.success("Đã xóa đơn vị");
            })
            .catch(() => {
                message.error("Không thể xóa, có lỗi xảy ra")
            })
    };


    const columns = [
        {
            title: 'Tên (VN)',
            dataIndex: 'vn_name',
            key: 'vn_name',
        },
        {
            title: 'Tên (EN)',
            dataIndex: 'en_name',
            key: 'en_name',
        },
        {
            title: 'Tên (ABV)',
            key: 'abbreviation',
            dataIndex: 'abbreviation',
            render: abv => (
                <Tag color='green' key={abv}>
                    {abv !== "undefined" ? abv.toUpperCase() : ""}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="circle" icon={<InfoCircleOutlined />}
                            onClick={() => showDrawer(record)}/>
                    <Popconfirm
                        title="Xóa đơn vị này?"
                        onConfirm={() => onDeleteIns(record.uuid)}
                    >
                        <Button type="danger" shape="circle" icon={<DeleteOutlined />}/>
                    </Popconfirm>
                    {
                        !record.parent_uuid ?
                            <Button
                                type="dashed"
                                shape="circle"
                                icon={<AppstoreAddOutlined />}
                                onClick={() => showDrawerCreate(record)}
                            />
                            : ''
                    }
                </Space>
            ),
        },
    ];

    const [isEdited, setIsEdited] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);

    useEffect(() => {
        if(createSuccess) onCloseModalCreate();
        setEditSuccess(false)
        onClose();

        dispatch(actions.getAllInstitution());

    }, [editSuccess, createSuccess])

    useEffect(() => {
        listInstitutions.map((ins, index) => {
            ins.stt = index + 1;
            return ins;
        })
    }, [listInstitutions])

    const showDrawer = (record) => {
        setIsEdited(false);
        setIns(record);
        setVisible(true);
    };

    const showDrawerCreate = (parentIns) => {
        setParentIns(parentIns);
        setVisibleDrawerCreate(true);
    }


    const onClose = () => {
        setVisible(false)
    };

    const onCloseModalCreate = () => {
        setVisibleDrawerCreate(false);
    }

    const detailComponent = () => {
        return (
            <Descriptions
                title={ins.vn_name}
                bordered
                column={1}
                contentStyle={{
                    width: '75%'
                }}
            >
                <Descriptions.Item label="Tên đơn vị (TV)" span={3}>{ins.vn_name}</Descriptions.Item>
                <Descriptions.Item label="Tên đơn vị (TA)" span={3}>{ins.en_name}</Descriptions.Item>
                <Descriptions.Item label="Tên đơn vị (ABV)"
                                   span={3}>{ins.abbreviation !== "undefined" ? ins.abbreviation : ""}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ"
                                   span={3}>{ins.address !== "undefined" ? ins.address : ""}</Descriptions.Item>
                <Descriptions.Item label="Mô tả"
                                   span={3}>{ins.description !== "undefined" ? ins.description : ""}</Descriptions.Item>
                <Descriptions.Item label="Logo" span={3}>
                    <Image
                        width={250}
                        src={ins.logo}
                    />
                </Descriptions.Item>
            </Descriptions>
        )
    }

    const editComponent = () => {
        return (
            <CreateInstitutionPage
                isEdited={true}
                institution={ins}
                editSuccess={setEditSuccess}
                onCloseDrawer={onClose}
            />
        )
    }

    return loading ? <Spin size="large"/> : (
        <>
            <Table
                columns={columns}
                dataSource={
                    listInstitutions
                        .filter(ins => ins.parent_uuid === null)
                        .map(ins => {
                            ins.key = ins.uuid;
                            return ins;
                        })
                }
                bordered
                indentSize={40}
                pagination={{position: ['bottomCenter']}}
            />
            <Drawer
                width={800}
                placement="right"
                closable={true}
                onClose={onClose}
                visible={visible}
                title={isEdited ? "Cập nhật thông tin đơn vị" : "Thông tin chi tiết đơn vị"}
            >
                {
                    !isEdited ? <Button
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined/>}
                        style={{float: 'right'}}
                        onClick={() => setIsEdited(!isEdited)}
                    /> : ""
                }
                {!isEdited ? detailComponent() : editComponent()}
            </Drawer>

            <Drawer
                closable={true}
                width={800}
                placement="right"
                visible={visibleDrawerCreate}
                onClose={onCloseModalCreate}
                title={`Thêm mới bộ môn, PTN: ${parentIns ? parentIns.vn_name : ''} `}
            >
                <CreateInstitutionPage parentIns={parentIns}/>
            </Drawer>
        </>

    );
}

export default ListInstitutionPage;