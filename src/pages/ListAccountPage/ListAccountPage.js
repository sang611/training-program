import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import * as actionTypes from '../../redux/actions/actionTypes'
import {
    Avatar,
    Button,
    Col,
    Descriptions,
    List,
    message,
    Pagination,
    Popconfirm,
    Row,
    Skeleton,
    Space,
    Tabs
} from "antd";
import Search from "antd/lib/input/Search";
import {
    AndroidOutlined,
    AppleOutlined, DeleteRowOutlined,
    DesktopOutlined,
    InfoCircleOutlined,
    MailOutlined,
    PhoneOutlined
} from "@ant-design/icons";
import {Redirect, useHistory} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller';
import axios from "axios";


const ListAccountPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const state = useSelector((state) => state.accounts);

    const {isValidToken, currentUser, userRole} = useSelector((state) => state.auth)

    const [isLoading, setIsLoading] = useState(false);
    const [typeAccount, setTypeAccount] = useState('GV');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        dispatch(actions.fetchAccounts({typeAccount, fullnameSearch: searchText}))
    }, [typeAccount, searchText])

    const onDeleteAccount = (item) => {
        let apiUrl = "";
        if (item.account.role == 1 || item.account.role == 2) {
            apiUrl = `employees/${item.uuid}`;
        } else if (item.account.role == 3) {
            apiUrl = `students/${item.uuid}`;
        }
        axios.delete(apiUrl)
            .then((res) => {
                message.success(res.data.message)
                dispatch(actions.fetchAccounts({typeAccount, fullnameSearch: searchText}))
            })
            .catch((e) => message.error(e.response.data.message))
    }

    const actionsToItem = function (item) {
        return (
            userRole == 0 ?
                [
                    <a
                        >

                    </a>,

                    <Button
                        type="primary"
                        shape="round"
                        size="small"
                        icon={<InfoCircleOutlined />}
                        key="list-load-detail"
                        onClick={() => history.push(`/uet/user/${item.account.uuid}`)}
                    >
                        Chi tiết
                    </Button>,

                    <Popconfirm
                        title="Xóa người dùng này?"
                        onConfirm={() => onDeleteAccount(item)}
                        okText="Xóa"
                        cancelText="Thoát"
                    >
                        <Button
                            type="danger"
                            shape="round"
                            size="small"
                            icon={<DeleteRowOutlined />}
                            key="list-delete-item"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>

                ] :
                [
                    <a
                        key="list-loadmore-more"
                        onClick={() => history.push(`/uet/user/${item.account.uuid}`)}>
                        Chi tiết
                    </a>

                ]
        )
    }


    return (
        <div>
            <Row>
                <Col span={8}>
                    {
                        userRole == 0 ?
                            <Tabs defaultActiveKey="1" onTabClick={(e) => setTypeAccount(e)}>
                                <Tabs.TabPane
                                    tab={
                                        <span>
                                  <i className="fas fa-chalkboard-teacher"/>&ensp;
                                            Giảng viên
                                </span>
                                    }
                                    key="GV"
                                >
                                </Tabs.TabPane>
                                <Tabs.TabPane
                                    tab={
                                        <span>
                                  <i className="fas fa-user-graduate"/>&ensp;
                                            Sinh viên
                                </span>
                                    }
                                    key="SV"
                                >
                                </Tabs.TabPane>
                            </Tabs>
                            : ''
                    }

                </Col>
                <Col span={8} offset={8}>
                    <Search
                        placeholder="Nhập để tìm"
                        enterButton="Tìm kiếm"
                        size="large"
                        loading={false}
                        onChange={(e) => {
                            console.log(e.target.value)
                            setSearchText(e.target.value);
                        }
                        }

                    />
                </Col>
            </Row>

            <br/>

            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={state.accounts ? state.accounts.accounts : []}
                size="large"
                renderItem={(item) => (
                    <List.Item
                        actions={actionsToItem(item)}
                        key={item.uuid}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar src={
                                    function () {
                                        if (item) {
                                            if (item.avatar) {
                                                return item.avatar.includes(':') ? item.avatar : `data:image/jpeg;base64, ${item.avatar}`
                                            } else {
                                                if(item.gender == "Nam")
                                                    return "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                                                else
                                                    return "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                                            }
                                        } else return ''
                                    }()
                                }
                                        size={64}/>
                            }
                            title={item.fullname}
                            description={
                                <Descriptions size={"small"} column={{xs: 1, sm: 1, md: 2}}>
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <MailOutlined/>&ensp;{item.vnu_mail}
                                    </Descriptions.Item>
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <PhoneOutlined/>&ensp;{item.phone_number}
                                    </Descriptions.Item>
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <DesktopOutlined/>&ensp;{item.institution ? item.institution.vn_name : ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <DesktopOutlined/>&ensp;{item.institution ? item.institution.parent.vn_name : ''}
                                    </Descriptions.Item>
                                </Descriptions>
                            }
                        />

                    </List.Item>
                )}
            />
            <br/>
            <Row>
                <Col>
                    <Pagination
                        current={currentPage}
                        pageSize={10}
                        total={state.accounts ? state.accounts.totalResults : ""}
                        onChange={(e) => {
                            setCurrentPage(e)
                        }}
                    />
                </Col>
            </Row>
        </div>

    );
}

export default ListAccountPage;
