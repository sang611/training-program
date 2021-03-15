import {Breadcrumb, Row, Col, Divider, Image, Layout, Menu} from "antd";
import {
    BankOutlined,
    DesktopOutlined,
    FileOutlined, LogoutOutlined, PartitionOutlined,
    PieChartOutlined,
    ReadOutlined, TableOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import 'antd/dist/antd.css';
import {useState} from "react";
import './DashboardPage.css'
import * as actions from '../../redux/actions'
import {useDispatch, useSelector} from "react-redux";
import {Link, Redirect, Route, Switch} from "react-router-dom";
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

const cookies = new Cookies();
const DashboardPage = () => {
    const {Header, Content, Footer, Sider} = Layout;
    const {SubMenu} = Menu;
    const [collapsed, setCollapsed] = useState(false);

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth)
    const [isSignin, setIsSignIn] = useState(cookies.get("isAuth"))

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
        document.getElementById("logo").style.display = collapsed ? "none" : "block"
        if (collapsed) {
            setTimeout(() => {
                document.querySelector("#layout-content").style.marginLeft = '80px';
            }, 200)
        } else {

            document.querySelector("#layout-content").style.marginLeft = '260px';
        }


    };

    const onSignOut = () => {
        dispatch(actions.authLogout());
    }

    const onClickMenuItem = (value) => {
        localStorage.setItem("menu-active", value.key);
    }

    return isSignin ? (
        <Layout style={{minHeight: '100vh'}}>

            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                width={260}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                }}>
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
                    <Menu.Item key="1" icon={<PieChartOutlined/>}>
                        Thống kê
                    </Menu.Item>
                    <SubMenu key="sub0" icon={<DesktopOutlined/>} title="Chương trình đào tạo" className="sub-menu">
                        <Menu.Item key="2">
                            <Link to="/uet/training-programs">Danh sách</Link>
                        </Menu.Item>
                        {/*<Menu.Item key="3">
                            <Link to="/uet/training-programs/creation">Tạo mới</Link>
                        </Menu.Item>*/}
                        <Menu.Item key="4">Tài liệu</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub1" icon={<ReadOutlined/>} title="Học phần">
                        <Menu.Item key="5">
                            <Link to="/uet/courses">Danh sách</Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to="/uet/courses/creation">Tạo mới</Link>
                        </Menu.Item>
                        <Menu.Item key="7">Tài liệu</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TableOutlined/>} title="Chuẩn đầu ra">
                        <Menu.Item key="8">
                            <Link to="/uet/learning-outcomes">Danh sách CĐR</Link>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Link to="/uet/learning-outcome-titles">Danh sách đầu mục</Link>
                        </Menu.Item>
                        <Menu.Item key="10">Tài liệu</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<BankOutlined/>} title="Đơn vị chuyên môn">
                        <Menu.Item key="11"><Link to="/uet/institutions">Danh sách</Link></Menu.Item>
                        <Menu.Item key="12"><Link to="/uet/institutions/creation">Tạo mới</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<TeamOutlined/>} title="Tài khoản">
                        <Menu.Item key="13"><Link to="/uet/accounts">Danh sách</Link></Menu.Item>
                        <Menu.Item key="14"><Link to="/uet/accounts/creation">Tạo mới</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="15" icon={<PartitionOutlined/>}>
                        Ngành
                    </Menu.Item>
                    <Menu.Item key="16" icon={<FileOutlined/>}>
                        Các văn bản liên quan
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout className="site-layout" id="layout-content" style={{marginLeft: 260}}>
                <Header className="header">
                    <Menu theme="light" mode="horizontal" style={{marginLeft: 'auto'}}>
                        <Menu.Item key="1" onClick={onSignOut}>Đăng xuất <LogoutOutlined/></Menu.Item>
                    </Menu>
                </Header>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
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
                            <Route exact path="/uet/training-programs/updating/:uuid" component={UpdateTrainingProgramPage}/>

                            <Route path="/uet/courses/creation" component={CreateCoursePage}/>
                            <Route exact path="/uet/courses" component={ListCoursePage}/>

                            <Route exact path="/uet/courses/:uuid/outlines/creating" component={CreateOutlineCoursePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid" component={DetailOutlinePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines" component={ListOutlinePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid/updating" component={UpdateOutlinePage}/>

                            <Route path="/uet/learning-outcomes" component={LearningOutcomePage}/>
                            <Route path="/uet/learning-outcome-titles" component={LearningOutcomeTitlePage}/>

                        </Switch>
                    </div>
                </Content>
            </Layout>
        </Layout>
    ) : <Redirect to="/uet/signin"/>;
}

export default DashboardPage;