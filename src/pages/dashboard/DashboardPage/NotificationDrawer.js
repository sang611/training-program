import {Button, Descriptions, Divider, Drawer, List, message, Space, Tag} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions/notifications'
import axios from "axios";
import Text from "antd/lib/typography/Text";


const NotificationDrawer = ({
                                onClose,
                                visible,
                                notifications,
                                user
                            }) => {
    console.log(notifications)
    const [choosedNotify, setChoosedNotify] = useState(null);
    const [visibleChild, setVisibleChild] = useState(false);

    const dispatch = useDispatch()

    const showChildrenDrawer = () => {
        setVisibleChild(true)
    };
    const onChildrenDrawerClose = () => {
        setVisibleChild(false);
    };

    const acceptUpdatingTicket = (item, isAccepted) => {
        axios.post('/outlines/acception',
            {
                newOutlineContent: JSON.parse(item.edited_content),
                employeeUuid: item.employeeUuid,
                ticketUuid: item.uuid,
                isAccepted
            })
            .then((res) => {
                message.success(res.data.message)
            })
            .catch((e) => {
                if(e.response) message.error(e.response.message)
                else message.error(e.message);
            })
            .finally(() => {
                onChildrenDrawerClose();
                dispatch(actions.getAllNotification());
            })
    }

    return (
        <>
            <Drawer
                title="Thông báo"
                placement="right"
                closable
                onClose={onClose}
                visible={visible}
                width={500}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={
                        notifications
                    }
                    renderItem={item => item.outline && item.employee ? (
                        <List.Item
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.employee.avatar} size={50}/>}
                                title={
                                    <a
                                        onClick={() => {
                                            setChoosedNotify(item);
                                            showChildrenDrawer();
                                        }}
                                    >
                                        {
                                            item.is_accepted == null ?
                                            `${item.employee.fullname} (${item.employee.vnu_mail}) đã tạo yêu cầu chỉnh sửa đề cương` :
                                             <Text type="secondary">{`${item.employee.fullname} (${item.employee.vnu_mail}) đã tạo yêu cầu chỉnh sửa đề cương`}</Text>
                                        }
                                    </a>
                                }
                                description={
                                    <>
                                        <div>{`Học phần ${item.outline.course.course_name_vi} (${item.outline.course.course_code})`}</div>
                                        <div>{
                                            `${new Date(item.createdAt).getDate()}/${new Date(item.createdAt).getMonth()+1}/${new Date(item.createdAt).getFullYear()}
                                            `
                                        }</div>
                                    </>

                                }
                            />
                        </List.Item>
                    ) : ''}
                />
                {
                    choosedNotify ?
                        <Drawer
                            title={
                                function () {
                                    if(choosedNotify.is_accepted == true) {
                                        return <Tag color="green">Đã chấp nhận</Tag>
                                    }
                                    if(choosedNotify.is_accepted == false) {
                                        return <Tag color="red">Đã từ chối</Tag>
                                    }
                                }()
                            }
                            width={480}
                            closable={true}
                            onClose={onChildrenDrawerClose}
                            visible={visibleChild}
                        >
                            <Descriptions title="Thông tin học phần" column={1}>
                                <Descriptions.Item label="Tên học phần (vi)">
                                    {choosedNotify.outline.course.course_name_vi}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tên học phần (en)">
                                    {choosedNotify.outline.course.course_name_en}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Mã học phần">{choosedNotify.outline.course.course_code}</Descriptions.Item>
                                <Descriptions.Item
                                    label="Số tín chỉ">{choosedNotify.outline.course.credits}</Descriptions.Item>

                            </Descriptions>

                            <Divider/>
                            <Descriptions title="Thông tin giảng viên" column={1}>
                                <Descriptions.Item label="Họ tên">
                                    {
                                        choosedNotify.employee.fullname
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="Học hàm">
                                    {choosedNotify.employee.academic_degree}
                                </Descriptions.Item>
                                <Descriptions.Item label="Học vị">
                                    {choosedNotify.employee.academic_rank}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email VNU">
                                    {choosedNotify.employee.vnu_mail}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {choosedNotify.employee.email}
                                </Descriptions.Item>
                            </Descriptions>
                            <Divider/>
                            <Descriptions title="Thông tin chỉnh sửa" column={1}>
                                <Descriptions.Item label="Nội dung">
                                    {
                                        choosedNotify ? choosedNotify.description : ''
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                            <Divider/>
                            {
                                choosedNotify.is_accepted == null ?
                                    <Space align="baseline">
                                        <Button type="primary" shape="round"
                                                onClick={()=>acceptUpdatingTicket(choosedNotify, true)}
                                        >
                                            Accept
                                        </Button>
                                        <Button type="danger" shape="round"
                                                onClick={()=>acceptUpdatingTicket(choosedNotify, false)}
                                        >Reject</Button>
                                    </Space> : ''
                            }

                        </Drawer> : ''

                }

            </Drawer>
        </>
    )
}

export default NotificationDrawer;