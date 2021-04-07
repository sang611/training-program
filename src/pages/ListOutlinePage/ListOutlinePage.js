import {Button, Card, List, Spin} from "antd";
import {useEffect, useMemo, useState} from 'react'
import axios from "axios";
import {EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
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


    const OutlineItem = ({item}) => {
        return (
            <Card
                extra={
                    <Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}`}>Chi tiết</Link>
                }
                actions={[
                    <SettingOutlined key="setting" onClick={() => console.log("setting")}/>,
                    <Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}/updating`}>
                        <EditOutlined key="edit"/>
                    </Link>,
                    <EllipsisOutlined key="ellipsis"/>,
                ]}
                title={item.vn_name}
                hoverable
            >
                Card content
            </Card>
        )
    };

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
                renderItem={item => (
                    <List.Item>
                        <OutlineItem item={item}/>
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