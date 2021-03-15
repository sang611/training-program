import {Button, Card, List, Spin} from "antd";
import {useEffect, useState} from 'react'
import axios from "axios";
import {EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import Title from "antd/lib/typography/Title";


const ListOutlinePage = () => {
    const history = useHistory();
    const {uuid} = useParams();
    const dispatch = useDispatch();
    const {course, loadingACourse} = useSelector(state => state.courses)

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
                extra={<Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}`}>Chi tiết</Link>}
                actions={[
                    <SettingOutlined key="setting" onClick={() => console.log("setting")} />,
                    <Link to={`/uet/courses/${course.uuid}/outlines/${item.uuid}/updating`}>
                        <EditOutlined key="edit" />
                    </Link>,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
                title={item.vn_name}
            >
                Card content
            </Card>
        )
    }



    return !course ? <Spin /> : (
        <>
            <Title level={2}>
                {`Đề cương môn học ${course.course_name_vi} - ${course.course_code}`}
            </Title>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={outlines}
                renderItem={item => (
                    <List.Item>
                        <OutlineItem item={item} />
                    </List.Item>
                )}
            />
            <Button
                type="primary"
                shape="circle"
                danger
                icon={<PlusOutlined />}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 32
                }}
                onClick={() => {history.push(`/uet/courses/${course.uuid}/outlines/creating`)}}
            />
        </>
    )
}

export default ListOutlinePage;