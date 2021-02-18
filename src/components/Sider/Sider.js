import {Divider, Image, Menu} from "antd";
import {
    BankOutlined,
    DesktopOutlined,
    FileOutlined, PartitionOutlined,
    PieChartOutlined,
    ReadOutlined,
    TableOutlined,
    TeamOutlined
} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useState} from "react";
import Sider from "antd/lib/layout/Sider";

const SiderMenu = () => {
    const {SubMenu} = Menu;
    const [collapsed, setCollapsed] = useState(false);
    const onCollapse = collapsed => {
        setCollapsed(collapsed);
        document.getElementById("logo").style.display = collapsed ? "none" : "block"
    };
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} width={260}>
            <div className="logo" id="logo">
                <Divider>
                    <Image
                        width={100}
                        src="https://image.winudf.com/v2/image/Y29tLm5ndXllbmhvcHF1YW5nLnVldG5ld3NfaWNvbl8xNTA5NzUxMzAyXzA1NQ/icon.png?w=170&fakeurl=1"
                    />
                </Divider>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Thống kê
                </Menu.Item>
                <SubMenu key="sub0" icon={<DesktopOutlined/>} title="Chương trình đào tạo">
                    <Menu.Item key="2">Danh sách</Menu.Item>
                    <Menu.Item key="3">Tạo mới</Menu.Item>
                    <Menu.Item key="4">Tài liệu</Menu.Item>
                </SubMenu>
                <SubMenu key="sub1" icon={<ReadOutlined/>} title="Học phần">
                    <Menu.Item key="5">Danh sách</Menu.Item>
                    <Menu.Item key="6">Tạo mới</Menu.Item>
                    <Menu.Item key="7">Tài liệu</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TableOutlined/>} title="Chuẩn đầu ra">
                    <Menu.Item key="8">Danh sách</Menu.Item>
                    <Menu.Item key="9">Tạo mới</Menu.Item>
                    <Menu.Item key="10">Tài liệu</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<BankOutlined/>} title="Đơn vị chuyên môn">
                    <Menu.Item key="11"><Link to="/uet/institutions">Danh sách</Link></Menu.Item>
                    <Menu.Item key="12"><Link to="/uet/institutions/creation">Tạo mới</Link></Menu.Item>

                </SubMenu>
                <Menu.Item key="13" icon={<TeamOutlined/>}>
                    Tài khoản
                </Menu.Item>
                <Menu.Item key="14" icon={<PartitionOutlined/>}>
                    Ngành
                </Menu.Item>
                <Menu.Item key="15" icon={<FileOutlined/>}>
                    Các văn bản liên quan
                </Menu.Item>
            </Menu>
        </Sider>
    );
}

export default SiderMenu;