import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions'
import {
    Avatar,
    Button,
    Col,
    Collapse,
    Descriptions,
    List,
    message,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Spin,
    Tabs
} from "antd";
import Search from "antd/lib/input/Search";
import {DeleteRowOutlined, DesktopOutlined, InfoCircleOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {useHistory, useLocation} from "react-router-dom";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
import './ListAccountPage.css'
import {classCodes} from '../../../constants'
import SearchFormLecturer from "./SearchFormLecturer";
import SearchFormStudent from "./SearchFormStudent";
import SearchFormCourse from "../../course/ListCoursePage/SearchFormCourse";

const ListAccountPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const query = new URLSearchParams(useLocation().search)
    const {accounts, totalAccounts, loadingAll} = useSelector((state) => state.accounts);

    const {userRole} = useSelector((state) => state.auth)

    const [typeAccount, setTypeAccount] = useState(query.get('type') || "GV");
    const [currentPageLec, setCurrentPageLec] = useState(1);
    const [currentPageStu, setCurrentPageStu] = useState(1);

    const [searchObj, setSearchObj] = useState();

    useEffect(() => {
        dispatch(actions.fetchAccounts({
            page: 1,
            typeAccount: typeAccount,
        }))

        setSearchObj();
    }, [typeAccount])

    const onChangePage = (page) => {
        if (typeAccount === "GV") {
            setCurrentPageLec(page);
        } else if (typeAccount === "SV") {
            setCurrentPageStu(page);
        }

        dispatch(actions.fetchAccounts({
            page: page,
            typeAccount: typeAccount,
            ...searchObj,
        }))

    }

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
                dispatch(actions.fetchAccounts({
                    page: typeAccount === "SV" ? currentPageStu : currentPageLec,
                    typeAccount: typeAccount,
                    ...searchObj
                }))
            })
            .catch((e) => message.error(e.response.data.message))
    }

    const actionsToItem = function (item) {
        return (
            userRole < 2 ?
                [
                    <Button
                        type="primary"
                        shape="round"
                        size="small"
                        icon={<InfoCircleOutlined/>}
                        key="list-load-detail"
                        onClick={() => history.push(`/uet/users/${item.account.uuid}`)}
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
                        userRole < 2 ?
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

            </Row>

            <Collapse bordered={true} defaultActiveKey={[]}>
                <Collapse.Panel header={`Tìm kiếm ${typeAccount === "GV" ? "giảng viên" : "sinh viên"} `} key="1">
                    {
                        typeAccount === "GV" ?
                            <SearchFormLecturer
                                currentPage={currentPageLec}
                                setCurrentPage={setCurrentPageLec}
                                searchObj={searchObj}
                                setSearchObj={setSearchObj}

                            /> :
                            <SearchFormStudent
                                currentPage={currentPageStu}
                                setCurrentPage={setCurrentPageStu}
                                searchObj={searchObj}
                                setSearchObj={setSearchObj}

                            />
                    }
                </Collapse.Panel>
            </Collapse>

            <div className="demo-infinite-container">
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={accounts}
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
                                                    if (item.gender === "Nam")
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

                                        {
                                            item.account.role < 3 ?
                                                <>
                                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                                        <DesktopOutlined/>&ensp;{item.institution.vn_name}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                                        <i className="fab fa-medapps"/>&ensp;{`${item.academic_rank || ''} ${item.academic_degree || ''}`}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                                        <i className="fas fa-layer-group"/>&ensp;{item.note}
                                                    </Descriptions.Item>
                                                </> :
                                                <>
                                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                                        <i className="fas fa-house-user"/>&ensp;
                                                        {`${item.grade} - ${item.class}`}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item contentStyle={{color: "gray"}}>
                                                        <DesktopOutlined/>&ensp;{item.training_program.institution ? item.training_program.institution.vn_name : ''}
                                                    </Descriptions.Item>
                                                </>
                                        }

                                    </Descriptions>
                                }
                            />

                        </List.Item>
                    )}
                >
                </List>

            </div>
            <br/>
            <Row>
                <Col>
                    {
                        typeAccount === "GV" ?
                            <Pagination
                                current={currentPageLec}
                                total={totalAccounts}
                                onChange={onChangePage}
                            /> :
                            <Pagination
                                current={currentPageStu}
                                total={totalAccounts}
                                onChange={onChangePage}
                                showSizeChanger={false}
                            />
                    }
                </Col>
            </Row>
        </div>

    );
}

export default ListAccountPage;
