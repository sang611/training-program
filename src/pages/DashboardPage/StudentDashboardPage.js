import {Breadcrumb, Image, Layout, Menu, Row} from "antd";
import {Content, Header} from "antd/lib/layout/layout";
import 'antd/dist/antd.css';
import './StudentDashboardPage.css'
import {Link, Route, Switch} from "react-router-dom";
import ListInstitutionPage from "../ListInstitutionPage";
import ListAccountPage from "../ListAccountPage";
import ListTrainingProgramPage from "../ListTrainingProgramPage";
import DetailTrainingProgramPage from "../DetailTrainingProgramPage";
import ListCoursePage from "../ListCoursePage";
import DetailOutlinePage from "../DetailOutlinePage";
import ListOutlinePage from "../ListOutlinePage";
import PrivatePlanningPage from "../PrivatePlanningPage/PrivatePlanningPage";
import {ApartmentOutlined, CompassOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import Cookies from "universal-cookie";
import DetailAccountPage from "../DetailAccountPage";


const StudentDashboardPage = () => {
    const dispatch = useDispatch();
    const {currentUser, userRole} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)


    const onClickMenuItem = (value) => {
        if(value.key != "4" && value.key != "4-1")
        localStorage.setItem("menu-active-public", value.key);
    }

    return (
        <>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: '#fff' }}>
                    <Row justify={"space-between"}>
                        <Image
                            width={200}
                            height={60}
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThvCz8muc0jZq-zVRyEqFKdKAzQnUBt_6BVQ&usqp=CAU"
                        />
                        <Menu mode="horizontal" defaultSelectedKeys={[localStorage.getItem("menu-active-public") || 1]} onClick={onClickMenuItem}>
                            <Menu.Item key="1" icon={<ApartmentOutlined />}>
                                <Link to="/uet/training-programs">
                                    Chương trình đào tạo
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<TeamOutlined />}>
                                <Link to="/uet/accounts">Giảng viên</Link>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<CompassOutlined />}>
                                <Link to={`/uet/${currentUser.uuid}/planning`}>Kế hoạch học tập</Link>
                            </Menu.Item>
                            <SubMenu key="4" icon={<UserOutlined />} title={user.fullname}>

                               <Menu.Item key="4-1" onClick={() => dispatch(actions.authLogout())}>Đăng xuất</Menu.Item>

                            </SubMenu>
                        </Menu>
                    </Row>

                </Header>
                <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, height: '100%' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: '100%'}}>
                        <Switch>
                            <Route path="/uet/institutions" component={ListInstitutionPage}/>

                            <Route path="/uet/accounts" component={ListAccountPage}/>

                            <Route exact path="/uet/training-programs" component={ListTrainingProgramPage}/>
                            <Route exact path="/uet/training-programs/:uuid" component={DetailTrainingProgramPage}/>

                            <Route exact path="/uet/courses" component={ListCoursePage}/>

                            <Route exact path="/uet/courses/:uuid/outlines/:outlineUuid"
                                   component={DetailOutlinePage}/>
                            <Route exact path="/uet/courses/:uuid/outlines" component={ListOutlinePage}/>


                            <Route path="/uet/:userUuid/planning" component={PrivatePlanningPage}/>
                            <Route path="/uet/user/:uuid/:role" component={DetailAccountPage} />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        </>
    )
}

export default StudentDashboardPage;
