import {Badge, Breadcrumb, Divider, Drawer, Image, Layout, List, Menu, notification} from "antd";
import {
    BankOutlined, BellOutlined,
    DesktopOutlined,
    FileOutlined,
    LogoutOutlined,
    PartitionOutlined,
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
import {Link, Route, Switch} from "react-router-dom";
import CreateInstitutionPage from '../CreateInstitutionPage'
import ListInstitutionPage from '../ListInstitutionPage'
import CreateAccountPage from "../CreateAccountPage";
import Cookies from "universal-cookie";
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


const DashboardPage = () => {
    const {Header, Content, Sider} = Layout;
    const {SubMenu} = Menu;
    const dispatch = useDispatch();
    const {userRole, currentUser} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    const {notifications} = useSelector(state => state.notifications)

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

    }, [])

    useEffect(() => {
        dispatch(actions.getAllNotification());
    }, [])

    const onCollapse = collapsed => {
        if (collapsed) {
            setTimeout(() => {
                document.getElementById("header-nav").style.width = '100%'
                document.getElementById("nav-sider").style.overflow = '';
                document.querySelector("#layout-content").style.marginLeft = '0px';
            }, 100)
        } else {
            document.querySelector("#layout-content").style.marginLeft = '260px';
            document.getElementById("header-nav").style.width = 'calc(100% - 260px)'
        }
    };


    const onClickMenuItem = (value) => {
        localStorage.setItem("menu-active", value.key);
    }

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };


    return (
        <>
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    breakpoint="lg"
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
                        height: '100%',
                        overflow: 'auto',
                    }}
                    id="nav-sider"
                >
                    <div className="logo" id="logo">
                        <Divider>
                            <Image
                                width={100}
                                src="https://image.winudf.com/v2/image/Y29tLm5ndXllbmhvcHF1YW5nLnVldG5ld3NfaWNvbl8xNTA5NzUxMzAyXzA1NQ/icon.png?w=170&fakeurl=1"
                            />
                        </Divider>
                    </div>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={[localStorage.getItem("menu-active")]}
                        mode="inline" onClick={onClickMenuItem}
                    >
                        <SubMenu key="sub0" icon={<DesktopOutlined/>} title="Chương trình đào tạo" className="sub-menu">
                            <Menu.Item key="2" className="menu-item-child">
                                <Link to="/uet/training-programs">Danh sách</Link>
                            </Menu.Item>
                            <Menu.Item key="4" className="menu-item-child">
                                <Link to="/uet/documents/training-program">Tài liệu</Link>
                            </Menu.Item>
                        </SubMenu>
                        {
                            <SubMenu key="sub1" icon={<ReadOutlined/>} title="Học phần" className="sub-menu">
                                <Menu.Item key="5" className="menu-item-child">
                                    <Link to="/uet/courses">Danh sách</Link>
                                </Menu.Item>
                                {/* <Menu.Item key="6" className="menu-item-child">
                                            <Link to="/uet/courses/creation">Tạo mới</Link>
                                        </Menu.Item>*/}
                                <Menu.Item key="7" className="menu-item-child">
                                    <Link to="/uet/documents/course">Tài liệu</Link>
                                </Menu.Item>
                            </SubMenu>
                        }

                        <SubMenu key="sub2" icon={<TableOutlined/>} title="Chuẩn đầu ra" className="sub-menu">
                            <Menu.Item key="8" className="menu-item-child">
                                <Link to="/uet/learning-outcomes">Danh sách CĐR</Link>
                            </Menu.Item>
                            {/*<Menu.Item key="9" className="menu-item-child">
                                        <Link to="/uet/learning-outcome-titles">Danh sách đầu mục</Link>
                                    </Menu.Item>*/}
                            <Menu.Item key="10" className="menu-item-child">
                                <Link to="/uet/documents/learning-outcome">Tài liệu</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<BankOutlined/>} title="Đơn vị chuyên môn" className="sub-menu">
                            <Menu.Item key="11" className="menu-item-child"><Link to="/uet/institutions">Danh
                                sách</Link></Menu.Item>
                            <Menu.Item key="12" className="menu-item-child"><Link to="/uet/institutions/creation">Tạo
                                mới</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" icon={<TeamOutlined/>} title="Tài khoản" className="sub-menu">
                            <Menu.Item key="13" className="menu-item-child"><Link to="/uet/accounts">Danh
                                sách</Link></Menu.Item>
                            <Menu.Item key="14" className="menu-item-child"><Link to="/uet/accounts/creation">Tạo
                                mới</Link></Menu.Item>
                        </SubMenu>
                        <Menu.Item key="15" icon={<PartitionOutlined/>} className="sub-menu">
                            <Link to="/uet/majors">Ngành</Link>
                        </Menu.Item>
                        <Menu.Item key="16" icon={<FileOutlined/>} className="sub-menu">
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
                            }/>} title={"    admin"}>
                                <Menu.Item
                                    key="4-1"
                                    icon={<SolutionOutlined/>}
                                >
                                    <Link to={`/uet/user/${currentUser.uuid}`}>Hồ sơ</Link>
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
                            <Switch>
                                <Route path="/uet/institutions/creation" component={CreateInstitutionPage}/>
                                <Route path="/uet/institutions" component={ListInstitutionPage}/>

                                <Route path="/uet/accounts/creation" component={CreateAccountPage}/>
                                <Route path="/uet/accounts" component={ListAccountPage}/>

                                <Route path="/uet/training-programs/creation" component={CreateTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs" component={ListTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs/:uuid" component={DetailTrainingProgramPage}/>
                                <Route exact path="/uet/training-programs/updating/:uuid"
                                       component={UpdateTrainingProgramPage}/>

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

                                <Route path="/uet/user/:uuid" component={DetailAccountPage}/>
                                <Route path="/uet/documents/:doc_of" component={DocumentPage}/>

                                <Route path="/uet/majors" component={MajorPage}/>

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
