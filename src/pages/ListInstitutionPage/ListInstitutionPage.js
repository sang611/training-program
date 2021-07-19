import {
    Button,
    Descriptions,
    Drawer,
    Image,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    Tag
} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions/institutions'
import axios from "axios";
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    PlusOutlined, ReloadOutlined,
    SearchOutlined
} from "@ant-design/icons";
import CreateInstitutionPage from "../CreateInstitutionPage";

const ListInstitutionPage = () => {
    const [visible, setVisible] = useState(false);
    const [visibleDrawerCreate, setVisibleDrawerCreate] = useState(false);
    const [ins, setIns] = useState({});
    const [parentIns, setParentIns] = useState(null);
    const dispatch = useDispatch();

    const {loading, listInstitutions, createSuccess} = useSelector(state => state.institutions)
    const [isEdited, setIsEdited] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const initialSearchObj = {
        vn_name: "",
        en_name: "",
        abbreviation: ""
    }

    const [searchObj, setSearchObj] = useState(initialSearchObj)

    useEffect(() => {
        dispatch(actions.getAllInstitution(searchObj));
    }, [searchObj])

    useEffect(() => {
        if(createSuccess) {
            dispatch(actions.getAllInstitution());
            onCloseDrawerCreate();
            handleCancel();
        }

        setEditSuccess(false)
        onClose();

    }, [editSuccess, createSuccess])


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onDeleteIns = async (id) => {
        await axios.delete(`/institutions/${id}`)
            .then(() => {
                dispatch(actions.getAllInstitution());
                message.success("Đã xóa một đơn vị");
            })
            .catch(() => {
                message.error("Không thể xóa, đã có lỗi xảy ra")
            })
    };

    const getColumnSearchProps = (dataIndex) => (
        {
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div style={{padding: 8}}>
                    <Input
                        placeholder={`Tìm kiếm`}
                        className="search_input_ins"
                        value={searchObj[dataIndex]}
                        onChange={e => {
                            setSearchObj({
                                ...searchObj,
                                [dataIndex]: e.target.value
                            })
                        }}
                        style={{width: dataIndex === "abbreviation" ? 140 : 300}}
                    />
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        }
    )


    const columns = [
        {
            title: 'Tên (VN)',
            dataIndex: 'vn_name',
            key: 'vn_name',
            ...getColumnSearchProps('vn_name')
        },
        {
            title: 'Tên (EN)',
            dataIndex: 'en_name',
            key: 'en_name',
            ...getColumnSearchProps('en_name')
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
            ...getColumnSearchProps('abbreviation')
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
                        okText="Xóa"
                        cancelText="Hủy"
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

    const onCloseDrawerCreate = () => {
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

    return (
        <>
            <Table
                columns={columns}
                loading={loading}
                dataSource={
                    listInstitutions
                        .filter(ins => {
                            let flag = true;
                            listInstitutions.forEach(_ins => {
                                _ins.children.forEach(childIns => {
                                    if (childIns.uuid === ins.uuid) {
                                        flag = false;
                                    }
                                })
                            })
                            return flag;
                        })
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
                onClose={onCloseDrawerCreate}
                title={`Thêm mới bộ môn, PTN: ${parentIns ? parentIns.vn_name : ''} `}
            >
                <CreateInstitutionPage parentIns={parentIns}/>
            </Drawer>
            <Modal
                title="Tạo mới đơn vị chuyên môn"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width='85vh'
                style={{
                    top: '5vh'
                }}
            >
                <CreateInstitutionPage/>
            </Modal>
            <Button
                type="primary"
                shape="circle"
                danger
                icon={<PlusOutlined/>}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 20,
                    bottom: 22
                }}
                onClick={showModal}
            />
            <Button
                type="primary"
                shape="circle"
                icon={<ReloadOutlined />}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 20,
                    bottom: 72
                }}
                onClick={() => {
                    setSearchObj(initialSearchObj);
                }}
            />
        </>

    );
}

export default ListInstitutionPage;
