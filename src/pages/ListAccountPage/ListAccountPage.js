import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import * as actionTypes from '../../redux/actions/actionTypes'
import {Avatar, Col, Descriptions, List, Pagination, Row, Skeleton, Tabs} from "antd";
import Search from "antd/lib/input/Search";
import {AndroidOutlined, AppleOutlined, DesktopOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {Redirect, useHistory} from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroller';


const ListAccountPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const state = useSelector((state) => state.accounts);

    const {isValidToken} = useSelector((state) => state.auth)

    const [isLoading, setIsLoading] = useState(false);
    const [typeAccount, setTypeAccount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (typeAccount == 1) {
            dispatch(actions.fetchAccounts({typeAccount: "GV", fullnameSearch: searchText}))
        } else if (typeAccount == 2) {
            console.log(typeAccount)
            dispatch(actions.fetchAccounts({typeAccount: "SV", fullnameSearch: searchText}))
        }
    }, [typeAccount, searchText])

    useEffect(() => {
        if (state.error) {
            if (state.error.response.status === 401) {
                dispatch(actions.authLogout());
            }
        }
    }, [state])


    return (
        <div>
            {isValidToken == false ? <Redirect to="/uet/signin"/> : ""}
            <Row>
                <Col span={8}>
                    <Tabs defaultActiveKey="1" onTabClick={(e) => setTypeAccount(e)}>
                        <Tabs.TabPane
                            tab={
                                <span>
                                  <AppleOutlined/>
                                  Giảng viên
                                </span>
                            }
                            key="1"
                        >
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span>
                                  <AndroidOutlined/>
                                  Sinh viên
                                </span>
                            }
                            key="2"
                        >
                        </Tabs.TabPane>
                    </Tabs>
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
                renderItem={item => (
                    <List.Item
                        actions={[<a key="list-loadmore-more" onClick={() => history.push(`/uet/user/${item.account.uuid}/${item.account.role}`)}>Chi tiết</a>]}
                        key={item.uuid}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" size={50}/>
                            }
                            title={item.fullname}
                            description={
                                <Descriptions >
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <MailOutlined />&nbsp;{item.vnu_mail}
                                    </Descriptions.Item >
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <PhoneOutlined />&nbsp;{item.phone_number}
                                    </Descriptions.Item>
                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                        <DesktopOutlined />&nbsp;{item.institution.vn_name}
                                    </Descriptions.Item>

                                </Descriptions>
                            }
                        />

                    </List.Item>
                )}
            />
            <br/>
            <Row>
                <Col >
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