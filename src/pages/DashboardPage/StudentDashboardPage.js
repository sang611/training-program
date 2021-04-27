import {Breadcrumb, Image, Layout, Menu, notification} from "antd";
import {Content, Header} from "antd/lib/layout/layout";
import 'antd/dist/antd.css';
import {Link, Route, Switch, useHistory} from "react-router-dom";
import ListInstitutionPage from "../ListInstitutionPage";
import ListAccountPage from "../ListAccountPage";
import ListTrainingProgramPage from "../ListTrainingProgramPage";
import DetailTrainingProgramPage from "../DetailTrainingProgramPage";
import ListCoursePage from "../ListCoursePage";
import DetailOutlinePage from "../DetailOutlinePage";
import ListOutlinePage from "../ListOutlinePage";
import PrivatePlanningPage from "../PrivatePlanningPage/PrivatePlanningPage";
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
import * as actions from '../../redux/actions'
import DetailAccountPage from "../DetailAccountPage";
import DocumentPage from "../DocumentPage";
import StudentStatisticPage from "../StudentStatisticPage";
import CreateOutlineCoursePage from "../CreateOutlineCoursePage";
import Avatar from "antd/es/avatar/avatar";
import UpdateOutlinePage from "../UpdateOutlinePage";
import {io} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import ScrollToTop from "../../ScrollToTop";


const StudentDashboardPage = () => {
    const dispatch = useDispatch();
    const {currentUser, userRole} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    let socket = useRef(null);
    const URL = axios.defaults.baseURL;
    const history = useHistory();
    const [activeKey, setActiveKey] = useState(history.location.pathname);

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
                                userRole == 3 ?
                                    <Menu.Item key={`/uet/${currentUser.uuid}/planning`} icon={<CompassOutlined/>}>
                                        <Link to={`/uet/${currentUser.uuid}/planning`}>Tiến độ học tập</Link>
                                    </Menu.Item> : <></>

                            }
                            {
                                userRole == 3 ?
                                    <Menu.Item
                                        key="4-1"
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
                            <SubMenu key="4" icon={<Avatar src={
                                function () {
                                    if (user) {
                                        if (user.avatar) {
                                            return user.avatar.includes(':') ? user.avatar : `data:image/jpeg;base64, ${user.avatar}`
                                        } else return ''
                                    } else return ''
                                }()
                            }/>} title={" " + user.fullname}>

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
                    <Breadcrumb style={{margin: '16px 0'}}>
                        {/*<Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>*/}
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 30, minHeight: '100vh'}}>
                        <ScrollToTop />
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
