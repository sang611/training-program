import {Button, Card, Descriptions, List, message, Popconfirm, Spin, Tag} from "antd";
import React, {useEffect, useState} from 'react'
import axios from "axios";
import {DeleteOutlined, EditOutlined, EnterOutlined, InfoOutlined, PlusOutlined} from "@ant-design/icons";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import Title from "antd/lib/typography/Title";


const ListOutlinePage = (props) => {
    const history = useHistory();
    const {uuid} = useParams();

    const dispatch = useDispatch();
    const {course, loadingACourse} = useSelector(state => state.courses)
    const {userRole} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts);
    const [outlines, setOutlines] = useState([]);

    useEffect(async () => {
        await dispatch(actions.getACourse({courseUuid: uuid}))
        axios.get(`/outlines/${uuid}`)
            .then((res) => {
                setOutlines(res.data.outlines)
            })
    }, [])

    const onDeleteOutline = (item) => {
        axios.delete(`/outlines/${item.uuid}`)
            .then(res => {
                message.success("Đã xóa 1 đề cương");
                setOutlines(
                    outlines.filter(outline => outline.uuid != item.uuid)
                )
            })
            .catch(e => {
                message.error("Đã có lỗi xảy ra");
            })
    }

    const actionAdmin = (item) => [
        <Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}/updating`}>
            <EditOutlined key="edit"/>
        </Link>,

        <Popconfirm
            title="Xóa đề cương này?"
            cancelText="Hủy"
            okText="Xóa"
            onConfirm={() => onDeleteOutline(item)}
        >
            <DeleteOutlined/>
        </Popconfirm>,
    ]

    const actionModerator = (item) => [
        <Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}/updating`}>
            <EditOutlined key="edit"/>
        </Link>,

    ]


    const OutlineItem = ({item, index}) => {
        let createTime = new Date(item.createdAt)
        return (
            <Card
                extra={
                        <Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}`}>
                            <Button type="primary" shape="circle" icon={<InfoOutlined/>} size="small" />
                        </Link>
                }
                actions={function () {
                    if(userRole === 0 ) {
                        return actionAdmin(item)
                    } else if (user.courses.map(course=>course.uuid).includes(uuid)) {
                        return actionModerator(item)
                    }
                }()}
                title={`${createTime.getDate()}/${createTime.getMonth()}/${createTime.getFullYear()}`}
                hoverable
            >
                <Descriptions column={1}>
                    <Descriptions.Item label="Thời gian tạo">
                        <Tag color="volcano">
                            {
                                `${createTime.getHours()}:${createTime.getMinutes()} ${createTime.getDate()}/${createTime.getMonth()}/${createTime.getFullYear()}`
                            }
                        </Tag>

                    </Descriptions.Item>
                </Descriptions>
            </Card>
        )
    }

    const gridAdmin = {
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
        },
        gridNotAdmin = {
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
        };

    const checkIsModerator = () => {

        let c = user.courses.find(
            (courseAssign) => courseAssign.uuid === course.uuid
        )
        return !!c.employee_course.isModerator;

    }

    return !course ? <Spin/> : (
        <>
            <Title level={2}>
                {`Đề cương môn học ${course.course_name_vi} - ${course.course_code}`}
            </Title>
            <List
                grid={userRole === 0 ? gridAdmin : gridNotAdmin}
                dataSource={outlines}
                renderItem={(item, index) => (
                    <List.Item>
                        <OutlineItem item={item} index={index}/>
                    </List.Item>
                )}
            />
            {
                userRole === 0 || checkIsModerator() ?
                    <Button
                        type="primary"
                        shape="circle"
                        danger
                        icon={<PlusOutlined/>}
                        size={"large"}
                        style={{
                            position: 'fixed',
                            right: 52,
                            bottom: 32
                        }}
                        onClick={() => {
                            history.push(`/uet/courses/${course.uuid}/outlines/creating`)
                        }}
                    /> : ''
            }

        </>
    )
}

export default ListOutlinePage;
