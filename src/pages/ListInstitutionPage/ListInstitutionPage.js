import {
    Table,
    Tag,
    Space,
    Spin,
    Button,
    Popconfirm,
    message,
    Drawer,
    Row,
    Col,
    Divider,
    Image,
    Descriptions
} from 'antd';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions/institutions'
import axios from "axios";
import Icon, {ArrowRightOutlined, DownloadOutlined, ForwardOutlined, InfoCircleTwoTone} from "@ant-design/icons";

const ListInstitutionPage = () => {
    const [visible, setVisible] = useState(false);
    const [ins, setIns] = useState({});
    const dispatch = useDispatch();

    const {loading, listInstitutions} = useSelector(state => state.institutions)

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
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: text => <a>{text}</a>,
        },
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
                    <Button type="primary">
                        Edit
                    </Button>
                    <Popconfirm
                        title="Xóa đơn vị này?"
                        onConfirm={()=>onDeleteIns(record.uuid)}

                    >
                        <Button type="danger">
                            Delete
                        </Button>
                    </Popconfirm>
                    <Button type="dashed" shape="circle" icon={<InfoCircleTwoTone />} onClick={() => showDrawer(record)}/>
                </Space>
            ),
        },
    ];



    useEffect(() => {
        dispatch(actions.getAllInstitution());
    }, [])

    useEffect(() => {
        listInstitutions.map((ins, index) => {
            ins.stt = index + 1;
            return ins;
        })
    }, [listInstitutions])

    const showDrawer = (record) => {
        setIns(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false)
    };


    return loading ? <Spin size="large"/> : (
        <>
            <Table columns={columns} dataSource={listInstitutions} pagination={{position: ['bottomCenter']}}/>
            <Drawer
                width={800}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
            >
                <p className="site-description-item-profile-p" style={{marginBottom: 24}}>
                    Thông tin chi tiết đơn vị
                </p>
                <Divider/>

                <Descriptions title={ins.vn_name} bordered>
                    <Descriptions.Item label="Tên đơn vị (TV)" span={3}>{ins.vn_name}</Descriptions.Item>
                    <Descriptions.Item label="Tên đơn vị (TA)" span={3}>{ins.en_name}</Descriptions.Item>
                    <Descriptions.Item label="Tên đơn vị (ABV)" span={3}>{ins.abbreviation !== "undefined" ? ins.abbreviation : ""}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={3}>{ins.address !== "undefined" ? ins.address : ""}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả" span={3}>{ins.description !== "undefined" ? ins.description : ""}</Descriptions.Item>
                    <Descriptions.Item label="Logo" span={3}>
                        <Image
                            width={250}
                            src={ins.logo}
                        />
                    </Descriptions.Item>
                </Descriptions>

            </Drawer>
        </>

    );
}

export default ListInstitutionPage;