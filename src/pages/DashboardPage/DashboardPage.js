import {Badge, Breadcrumb, Image, Layout, Menu, notification, PageHeader} from "antd";
import {
    BankOutlined,
    BellOutlined,
    DesktopOutlined,
    FileOutlined,
    LogoutOutlined,
    PartitionOutlined,
    PieChartOutlined,
    ReadOutlined,
    SolutionOutlined,
    TableOutlined,
    TeamOutlined
} from "@ant-design/icons";
import 'antd/dist/antd.css';
import {useEffect, useRef, useState} from "react";
import './DashboardPage.css'
import * as actions from '../../redux/actions'
import {useDispatch, useSelector} from "react-redux";
import {Link, Route, Switch, useHistory, matchPath} from "react-router-dom";
import CreateInstitutionPage from '../CreateInstitutionPage'
import ListInstitutionPage from '../ListInstitutionPage'
import CreateAccountPage from "../CreateAccountPage";
import ListAccountPage from "../ListAccountPage";
import CreateTrainingProgramPage from "../CreateTrainingProgramPage";
import ListTrainingProgramPage from "../ListTrainingProgramPage";
import CreateCoursePage from "../CreateCoursePage";
import ListCoursePage from "../ListCoursePage";
import DetailTrainingProgramPage from "../DetailTrainingProgramPage";
import UpdateTrainingProgramPage from "../UpdateTrainingProgramPage";
import LearningOutcomePage from "../LearningOutcomePage/LearningOutcomePage";
import LearningOutcomeTitlePage from "../LearningOutcomeTitlePage/LearningOutcomePageTitle";
import CreateOutlineCoursePage from "../CreateOutlineCoursePage";
import ListOutlinePage from "../ListOutlinePage";
import DetailOutlinePage from "../DetailOutlinePage";
import UpdateOutlinePage from "../UpdateOutlinePage";
import DetailAccountPage from "../DetailAccountPage";
import DocumentPage from "../DocumentPage";
import MajorPage from "../MajorPage";
import SubMenu from "antd/lib/menu/SubMenu";
import {io} from "socket.io-client";
import Avatar from "antd/es/avatar/avatar";
import NotificationDrawer from "./NotificationDrawer";
import axios from "axios";
import AdminStatisticPage from "../AdminStatisticPage";
import ScrollToTop from "../../ScrollToTop";


const DashboardPage = () => {
    const {Header, Content, Sider} = Layout;
    const {SubMenu} = Menu;
    const dispatch = useDispatch();
    const history = useHistory();
    const {currentUser} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    const {notifications} = useSelector(state => state.notifications)
    const [activeKey, setActiveKey] = useState(history.location.pathname);
    //const [activeKey, setActiveKey] = useState(localStorage.getItem("menu-active"));

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
            path: '/uet/training-programs/clone/:uuid',
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


    let socket = useRef(null);
    const URL = axios.defaults.baseURL;

    useEffect(() => {
        socket.current = io(URL, {
            autoConnect: true,
        });

        socket.current.on('edit_outline', (data) => {
            notification.info({
                message: data,
            });
            dispatch(actions.getAllNotification());
        })

        return () => socket.current.disconnect()
    }, [])

    useEffect(() => {
        dispatch(actions.getAllNotification());
    }, [])

    const onCollapse = collapsed => {
        if (collapsed) {
            setTimeout(() => {
                document.getElementById("header-nav").style.width = '100%'
                document.getElementById("nav-sider").style.overflowY = '';
                document.querySelector("#layout-content").style.marginLeft = '0px';
            }, 100)
        } else {
            document.getElementById("header-nav").style.width = 'calc(100% - 260px)'
            document.querySelector("#layout-content").style.marginLeft = '260px';

        }
    };


    const onClickMenuItem = (value) => {
        setActiveKey(value.key)
        localStorage.setItem("menu-active", value.key);
    }

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const checkIsBackable = () => {
        const currentRoute = listRouteBackable.find(
            route => matchPath(history.location.pathname, route)
        )
        return currentRoute
    }

    return (
        <>
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    breakpoint="xl"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                        onCollapse(collapsed)
                    }}
                    width={'260px'}
                    style={{
                        position: 'fixed',
                        height: '100vh',
                        overflowY: 'auto'
                    }}
                    id="nav-sider"
                >
                    <div className="logo" id="logo">
                        <center>
                            <Image
                                width={150}
                                src={process.env.PUBLIC_URL + '/image/training-course.png'}
                                preview={false}
                            />
                        </center>
                    </div>
                    <br/>
                    <Menu
                        theme="dark"
                        selectedKeys={activeKey}
                        mode="inline"
                        onClick={onClickMenuItem}
                    >
                        <Menu.Item key="/uet/statistic" className="sub-menu" icon={<PieChartOutlined/>}>
                            <Link to="/uet/statistic">Trang chủ</Link>
                        </Menu.Item>
                        <SubMenu key="sub0" icon={<DesktopOutlined/>} title="Chương trình đào tạo" className="sub-menu">
                            <Menu.Item key="/uet/training-programs" className="menu-item-child">
                                <Link to="/uet/training-programs">Danh sách CTĐT</Link>
                            </Menu.Item>
                            <Menu.Item key="/uet/documents/training-program" className="menu-item-child">
                                <Link to="/uet/documents/training-program">Tài liệu CTĐT</Link>
                            </Menu.Item>
                        </SubMenu>
                        {
                            <SubMenu key="sub1" icon={<ReadOutlined/>} title="Học phần" className="sub-menu">
                                <Menu.Item key="/uet/courses" className="menu-item-child">
                                    <Link to="/uet/courses">Danh sách học phần</Link>
                                </Menu.Item>
                                {/* <Menu.Item key="6" className="menu-item-child">
                                            <Link to="/uet/courses/creation">Tạo mới</Link>
                                        </Menu.Item>*/}
                                <Menu.Item key="/uet/documents/course" className="menu-item-child">
                                    <Link to="/uet/documents/course">Tài liệu học phần</Link>
                                </Menu.Item>
                            </SubMenu>
                        }

                        <SubMenu key="sub2" icon={<TableOutlined/>} title="Chuẩn đầu ra" className="sub-menu">
                            <Menu.Item key="/uet/learning-outcome" className="menu-item-child">
                                <Link to="/uet/learning-outcomes">Danh sách CĐR</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<BankOutlined/>} title="Đơn vị chuyên môn" className="sub-menu">
                            <Menu.Item key="/uet/institutions" className="menu-item-child">
                                <Link to="/uet/institutions">
                                    Danh sách đơn vị
                                </Link>
                            </Menu.Item>
                            {/*<Menu.Item key="12" className="menu-item-child"><Link to="/uet/institutions/creation">Tạo
                                mới</Link></Menu.Item>*/}
                        </SubMenu>
                        <SubMenu key="sub4" icon={<TeamOutlined/>} title="Tài khoản" className="sub-menu">
                            <Menu.Item key="/uet/users" className="menu-item-child">
                                <Link to="/uet/users">Danh sách tài khoản</Link>
                            </Menu.Item>
                            <Menu.Item key="/uet/creation/accounts" className="menu-item-child">
                                <Link to="/uet/creation/accounts">Thêm mới tài khoản</Link>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="/uet/majors" icon={<PartitionOutlined/>} className="sub-menu">
                            <Link to="/uet/majors">Ngành đào tạo</Link>
                        </Menu.Item>
                        <Menu.Item key="/uet/documents/involved" icon={<FileOutlined/>} className="sub-menu">
                            <Link to="/uet/documents/involved">Các văn bản liên quan</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout className="site-layout" id="layout-content" style={{marginLeft: '260px'}}>
                    <Header
                        className="header"
                        id="header-nav"
                        style={{
                            position: 'fixed',
                            zIndex: 100,
                            backgroundColor: '#fff',
                            width: 'calc(100% - 260px)',
                            boxShadow: '0 0 5px gray'
                        }}
                    >
                        {
                            checkIsBackable() ? <>
                                <PageHeader
                                    className="site-page-header"
                                    onBack={() => {
                                        history.goBack()
                                    }}
                                    subTitle="Quay lại"
                                />
                            </> : ""
                        }

                        <Menu
                            mode="horizontal"
                            style={{
                                marginLeft: 'auto'
                            }}
                        >
                            <Menu.Item key="1" onClick={showDrawer}>

                                <Badge count={
                                    notifications
                                        .filter(noti => noti.is_accepted == null)
                                        .length
                                }>
                                    <BellOutlined
                                        style={{fontSize: '18px'}}
                                    />
                                </Badge>
                            </Menu.Item>
                            <SubMenu key="4" icon={<Avatar src={
                                function () {
                                    if (user) {
                                        if (user.avatar) {
                                            return user.avatar.includes(':') ? user.avatar : `data:image/jpeg;base64, ${user.avatar}`
                                        } else return ''
                                    } else return ''
                                }()
                            }
                            />
                            } title={"    admin"}>
                                <Menu.Item
                                    key="4-1"
                                    icon={<SolutionOutlined/>}
                                >
                                    <Link to={`/uet/users/${currentUser.uuid}`}>Hồ sơ</Link>
                                </Menu.Item>
                                <Menu.Item
                                    key="4-2"
                                    icon={<LogoutOutlined/>}
                                    onClick={() => dispatch(actions.authLogout())}
                                >
                                    Đăng xuất
                                </Menu.Item>

                            </SubMenu>
                        </Menu>

                    </Header>
                    <Content style={{margin: '0 16px', marginTop: '64px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                        </Breadcrumb>

                        <div className="site-layout-background" style={{padding: 24, minHeight: '100vh'}}>
                            <ScrollToTop/>
                            <Switch>
                                <Route path="/uet/institutions/creation" component={CreateInstitutionPage}/>
                                <Route path="/uet/institutions" component={ListInstitutionPage}/>

                                <Route exact path="/uet/creation/accounts" component={CreateAccountPage}/>
                                <Route exact path="/uet/users" component={ListAccountPage}/>

                                <Route path="/uet/training-programs/creation" component={CreateTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs" component={ListTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs/:uuid" component={DetailTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs/updating/:uuid" component={UpdateTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs/clone/:uuid" component={CreateTrainingProgramPage}/>

                                <Route path="/uet/courses/creation" component={CreateCoursePage}/>
                                <Route exact path="/uet/courses" component={ListCoursePage}/>

                                <Route exact path="/uet/courses/:uuid/outlines/creating"
                                       component={CreateOutlineCoursePage}/>
                                <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid"
                                       component={DetailOutlinePage}/>
                                <Route exact path="/uet/courses/:uuid/outlines" component={ListOutlinePage}/>
                                <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid/updating"
                                       component={UpdateOutlinePage}/>

                                <Route path="/uet/learning-outcomes" component={LearningOutcomePage}/>
                                <Route path="/uet/learning-outcome-titles" component={LearningOutcomeTitlePage}/>

                                <Route path="/uet/users/:uuid" component={DetailAccountPage}/>
                                <Route path="/uet/documents/:doc_of" component={DocumentPage}/>

                                <Route path="/uet/majors" component={MajorPage}/>
                                <Route path="/uet/statistic" component={AdminStatisticPage}/>
                            </Switch>
                        </div>
                    </Content>
                </Layout>

            </Layout>

            <NotificationDrawer
                onClose={onClose}
                visible={visible}
                notifications={notifications}
                user={user}
            />
        </>

    )
}

export default DashboardPage;
