import {Button, Card, List} from "antd";
import {useEffect, useState} from 'react'
import axios from "axios";
import {EditOutlined, EllipsisOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
import {Link, useHistory} from "react-router-dom";


const ListTrainingProgramPage = () => {
    const history = useHistory();

    const [trainingPrograms, setTrainingPrograms] = useState([]);
    useEffect(() => {
         axios.get("/training-programs")
             .then((res) => {
                 setTrainingPrograms(res.data)
             })
    }, [])

    const TrainingItem = ({item}) => {
        return (
            <Card
                extra={<Link to={`/uet/training-programs/${item.uuid}`}>Chi tiết</Link>}
                actions={[
                    <SettingOutlined key="setting" onClick={() => console.log("setting")} />,
                    <Link to={`/uet/training-programs/updating/${item.uuid}`}>
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
                onClick={() => {history.push("/uet/training-programs/creation")}}
            />
        </>
    )
}

export default ListTrainingProgramPage;