import {Breadcrumb, Image, Layout, Menu, notification} from "antd";
import {Content, Header} from "antd/lib/layout/layout";
import 'antd/dist/antd.css';
import {Link, Route, Switch, useHistory} from "react-router-dom";
import ListInstitutionPage from "../../institution/ListInstitutionPage";
import ListAccountPage from "../../account/ListAccountPage";
import ListTrainingProgramPage from "../../training_program/ListTrainingProgramPage";
import DetailTrainingProgramPage from "../../training_program/DetailTrainingProgramPage";
import ListCoursePage from "../../course/ListCoursePage";
import DetailOutlinePage from "../../outline/DetailOutlinePage";
import ListOutlinePage from "../../outline/ListOutlinePage";
import PrivatePlanningPage from "../../student_plan/PrivatePlanningPage/PrivatePlanningPage";
import {
    ApartmentOutlined,
    AuditOutlined,
    CompassOutlined,
    FileOutlined,
    LogoutOutlined, PieChartOutlined,
    SnippetsOutlined,
    SolutionOutlined,
    TeamOutlined
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions'
import DetailAccountPage from "../../account/DetailAccountPage";
import DocumentPage from "../../document/DocumentPage";
import StudentStatisticPage from "../../statistic/StudentStatisticPage";
import CreateOutlineCoursePage from "../../outline/CreateOutlineCoursePage";
import Avatar from "antd/es/avatar/avatar";
import UpdateOutlinePage from "../../outline/UpdateOutlinePage";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import ScrollToTop from "../../../ScrollToTop";


const StudentDashboardPage = () => {
    const dispatch = useDispatch();
    const {currentUser, userRole} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    let socket = useRef(null);
    const URL = axios.defaults.baseURL;
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(history.location.pathname);

    const listRouteBackable = [
        {
            path: '/uet/training-programs/:uuid',
            exact: true
        },
        {
            path: '/uet/training-programs/updating/:uuid',
            exact: true
        },
        {
            path: '/uet/training-programs/creation',
            exact: true
        },
        {
            path: '/uet/courses/:uuid/outlines',
            exact: true
        },
        {
            path: '/uet/courses/:uuid1/outlines/:uuid2',
            exact: true
        },
        {
            path: '/uet/courses/:uuid1/outlines/:uuid2/updating',
            exact: true
        },
        {
            path: '/uet/users/:uuid',
            exact: true
        },
    ]

    useEffect(() => {
        return history.listen(location => {
            if (history.action === 'PUSH') {
                setActiveKey(location.pathname)
            }

            if (history.action === 'POP') {
                setActiveKey(location.pathname)
            }
        })
    }, [])


    useEffect(() => {
        socket.current = io(URL, {
            autoConnect: true,
        });

        socket.current.on(user.uuid, (data) => {
            if (data.is_accepted) {
                notification.success({
                    message: data.message,
                });
            } else {
                notification.error({
                    message: data.message,
                });
            }
        })

        return () => socket.current.disconnect()

    }, [user])

    const onClickMenuItem = (value) => {
        if (value.key != "4" && value.key != "4-1")
            localStorage.setItem("menu-active-public", value.key);
    }

    return (
        <>
            <Layout>
                <Header style={{
                    position: 'fixed',
                    zIndex: 100,
                    width: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 5px gray',
                    padding: 0,
                    display: 'flex',
                }}
                >
                    <Image
                        src="http://www.ballinamorecs.ie/wp-content/uploads/2014/07/elearning-logo.png"
                        height='100%'
                        width={200}
                    />

                    <Menu
                        mode="horizontal"
                        selectedKeys={activeKey}
                        onClick={onClickMenuItem}
                        style={{
                            marginLeft: 'auto'
                        }}
                    >
                        <Menu.Item key="/uet/training-programs" icon={<ApartmentOutlined/>}>
                            <Link to="/uet/training-programs">
                                Chương trình đào tạo
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/uet/accounts" icon={<TeamOutlined/>}>
                            <Link to="/uet/accounts">Giảng viên</Link>
                        </Menu.Item>
                        {
                            userRole === 3 ?
                                <Menu.Item key={`/uet/${currentUser.uuid}/planning`} icon={<CompassOutlined/>}>
                                    <Link to={`/uet/${currentUser.uuid}/planning`}>Tiến độ học tập</Link>
                                </Menu.Item> : <></>

                        }
                        {
                            userRole === 3 ?
                                <Menu.Item
                                    key="/uet/statistic"
                                    icon={<PieChartOutlined/>}
                                >
                                    <Link to="/uet/statistic">Thống kê</Link>
                                </Menu.Item> : <></>
                        }
                        <SubMenu key="5" icon={<SnippetsOutlined/>} title="Tài liệu">
                            <Menu.Item
                                key="/uet/documents/training-program"
                                icon={<FileOutlined/>}
                            >
                                <Link to="/uet/documents/training-program">Tài liệu CTĐT</Link>
                            </Menu.Item>
                            <Menu.Item
                                key="/uet/documents/course"
                                icon={<AuditOutlined/>}
                            >
                                <Link to="/uet/documents/course">Tài liệu học phần</Link>
                            </Menu.Item>

                        </SubMenu>
                        <SubMenu
                            key="4"
                            icon={
                                <Avatar
                                    src={
                                        function () {
                                            if (user) {
                                                if (user.avatar) {
                                                    return user.avatar.includes(':') ? user.avatar : `data:image/jpeg;base64, ${user.avatar}`
                                                } else {
                                                    if (user.gender === "Nam")
                                                        return "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                                                    else
                                                        return "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
                                                }
                                            } else return ''
                                        }()
                                    }
                                />}
                            title={" " + user.fullname}
                        >

                            <Menu.Item
                                key={`/uet/user/${currentUser.uuid}`}
                                icon={<SolutionOutlined/>}
                            >

                                <Link to={`/uet/user/${currentUser.uuid}`}>Hồ sơ</Link>

                            </Menu.Item>
                            <Menu.Item
                                key="4-3"
                                icon={<LogoutOutlined/>}
                                onClick={() => dispatch(actions.authLogout())}
                            >
                                Đăng xuất
                            </Menu.Item>

                        </SubMenu>
                    </Menu>

                </Header>

                <Content className="site-layout" style={{padding: '0 50px', marginTop: 64, height: '100%'}}>

                    <div className="site-layout-background" style={{padding: 30, minHeight: '100vh'}}>
                        <ScrollToTop/>
                        <Switch>
                            <Route path="/uet/institutions" component={ListInstitutionPage}/>
                            <Route path="/uet/accounts" component={ListAccountPage}/>

                            <Route exact path="/uet/training-programs" component={ListTrainingProgramPage}/>
                            <Route exact path="/uet/training-programs/:uuid" component={DetailTrainingProgramPage}/>

                            <Route exact path="/uet/courses" component={ListCoursePage}/>

                            <Route exact path="/uet/courses/:uuid/outlines/creating"
                                   component={CreateOutlineCoursePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid" component={DetailOutlinePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines" component={ListOutlinePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid/updating"
                                   component={UpdateOutlinePage}/>
                            <Route path="/uet/:userUuid/planning" component={PrivatePlanningPage}/>
                            <Route path="/uet/user/:uuid" component={DetailAccountPage}/>

                            <Route path="/uet/documents/:doc_of" component={DocumentPage}/>
                            <Route path="/uet/statistic" component={StudentStatisticPage}/>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </>
    )
}

export default StudentDashboardPage;
