import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import {Avatar, Button, Col, Descriptions, List, message, Popconfirm, Row, Select, Spin, Tabs} from "antd";
import Search from "antd/lib/input/Search";
import {DeleteRowOutlined, DesktopOutlined, InfoCircleOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
import './ListAccountPage.css'

const ListAccountPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const query = new URLSearchParams(useLocation().search)
    const {accounts, totalAccounts, loadingAll} = useSelector((state) => state.accounts);

    const {userRole} = useSelector((state) => state.auth)

    const [typeAccount, setTypeAccount] = useState(query.get('type') || "GV");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [className, setClassname] = useState("Tất cả");

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [data, setData] = useState([]);
    const [resetFetch, setResetFetch] = useState(false);

    useEffect(() => {
        dispatch(actions.fetchAccounts({
            typeAccount,
            fullnameSearch: searchText,
            page: currentPage,
            studentClass: className
        }))
        setResetFetch(true)
    }, [currentPage])

    useEffect(() => {
        setData([])
        setCurrentPage(new Number(1));
        setHasMore(true);
    }, [typeAccount, searchText, className])


    useEffect(() => {
        if(resetFetch) {
            setData(data.concat(
                accounts.filter(acc => {
                    return !data.map(d => d.uuid).includes(acc.uuid)
                })
            ));
            setLoadingMore(false);
        }

    }, [accounts])

    const onDeleteAccount = (item) => {
        let apiUrl = "";
        if (item.account.role === 1 || item.account.role === 2) {
            apiUrl = `employees/${item.uuid}`;
        } else if (item.account.role === 3) {
            apiUrl = `students/${item.uuid}`;
        }
        axios.delete(apiUrl)
            .then((res) => {
                message.success(`Đã xóa thành công tài khoản người dùng ${item.fullname}`)
                //dispatch(actions.fetchAccounts({typeAccount, fullnameSearch: searchText, page: 1}))
                setData(
                    data.filter(u => u.uuid !== item.uuid)
                )
            })
            .catch((e) => message.error(e.response.data.message))
    }

    const handleInfiniteOnLoad = () => {
        setLoadingMore(true)
        setCurrentPage(currentPage + 1);
        if (data.length >= totalAccounts) {
            message.warning('Đã đến cuối danh sách');
            setHasMore(false);
            setLoadingMore(false);
        }
    };

    const actionsToItem = function (item) {
        return (
            userRole == 0 ?
                [
                    <Button
                        type="primary"
                        shape="round"
                        size="small"
                        icon={<InfoCircleOutlined/>}
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
                            icon={<DeleteRowOutlined/>}
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
                            <Tabs defaultActiveKey={query.get('type') || "GV"} onTabClick={(e) => setTypeAccount(e)}>
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
                <Col span={9} offset={7}>
                    <Row>
                        <Col span={6}>
                            {
                                typeAccount === "SV" ?
                                    <Select
                                        size="large"
                                        placeholder="Lớp"
                                        style={{width: '100%'}}
                                        onChange={(value => {
                                            setClassname(value)
                                        })}
                                        value={className}
                                    >
                                        {
                                            [   "Tất cả",
                                                "A-E", "C-A-C", "C-A-CLC1", "C-A-CLC2", "C-A-CLC3", "C-B",
                                                "C-C", "C-CLC", "C-D", "C-E", "C-F", "C-G", "C-H", "C-K",
                                                "C-L", "C-J", "N", "T", "Đ-A-CLC", "Đ-B", "K", "E", "V", "H",
                                                "M1", "M2", "M3", "M4", "XD-GT"
                                            ].map(cl => (
                                                <Select.Option value={cl} key={cl}>{cl}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                    : ''
                            }

                        </Col>
                        <Col span={18}>
                            <Search
                                placeholder="Nhập để tìm"
                                enterButton
                                size="large"
                                style={{width: '100%'}}
                                loading={false}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                }
                                }

                            />
                        </Col>


                    </Row>


                </Col>
            </Row>

            <br/>

            <div className="demo-infinite-container">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={handleInfiniteOnLoad}
                    hasMore={!loadingMore && hasMore}
                    useWindow={false}
                >
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={data}
                        size="large"
                        loading={loadingAll}
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
                                                        if (item.gender == "Nam")
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
                                            {
                                                item.account.role < 3 ?
                                                    <>
                                                        <Descriptions.Item contentStyle={{color: "gray"}}>
                                                            <DesktopOutlined/>&ensp;{item.institution ? item.institution.vn_name : ''}
                                                        </Descriptions.Item>
                                                        <Descriptions.Item contentStyle={{color: "gray"}}>
                                                            <DesktopOutlined/>&ensp;{item.institution ? item.institution.parent.vn_name : ''}
                                                        </Descriptions.Item>
                                                    </> :
                                                    <>
                                                        <Descriptions.Item contentStyle={{color: "gray"}}>
                                                            <i className="fas fa-house-user"/>&ensp;
                                                            {`${item.grade} ${item.class}`}
                                                        </Descriptions.Item>
                                                    </>
                                            }

                                        </Descriptions>
                                    }
                                />

                            </List.Item>
                        )}
                    >
                        {loadingMore && hasMore && (
                            <div className="demo-loading-container">
                                <Spin/>
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
            <br/>
            {/*<Row>
                <Col>
                    <Pagination
                        current={currentPage}
                        total={totalAccounts}
                        onChange={(e) => {
                            setCurrentPage(e)
                        }}
                    />
                </Col>
            </Row>*/}
        </div>

    );
}

export default ListAccountPage;
