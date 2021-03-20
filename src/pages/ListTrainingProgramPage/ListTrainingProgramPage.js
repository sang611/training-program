import {Button, Card, List} from "antd";
import {useEffect, useState} from 'react'
import axios from "axios";
import {EditOutlined, EllipsisOutlined, PlusOutlined, SelectOutlined, SettingOutlined} from "@ant-design/icons";
import {Link, useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ListTrainingProgramPage = () => {
    const history = useHistory();

    const [trainingPrograms, setTrainingPrograms] = useState([]);
    const user = cookies.get("account")
    useEffect(() => {
         axios.get("/training-programs")
             .then((res) => {
                 setTrainingPrograms(res.data)
             })
    }, [])

    const studentJoinTraining = () => {
        axios.post("/")
    }

    const TrainingItem = ({item}) => {
        return (
            <Card
                extra={<Link to={`/uet/training-programs/${item.uuid}`}>Chi tiết</Link>}
                actions={user.role == 0 ? [
                    <SettingOutlined key="setting" onClick={() => console.log("setting")} />,
                    <Link to={`/uet/training-programs/updating/${item.uuid}`}>
                        <EditOutlined key="edit" />
                    </Link>,
                    <EllipsisOutlined key="ellipsis" />,
                ] : [
                    <SelectOutlined key="setting" onClick={() => console.log("setting")} />,
                    <SettingOutlined key="setting" onClick={() => console.log("setting")} />,
                ]
                }
                title={item.vn_name}
            >
                Card content
            </Card>
        )
    }



    return (
        <>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={trainingPrograms.training_programs}
                renderItem={item => (
                    <List.Item>
                        <TrainingItem item={item} />
                    </List.Item>
                )}
            />
            {user.role == 0 ? <Button
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
                    history.push("/uet/training-programs/creation")
                }}
            /> : ""}
        </>
    )
}

export default ListTrainingProgramPage;