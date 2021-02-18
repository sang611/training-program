import {Card, List} from "antd";
import {useState, useEffect} from 'react'
import axios from "axios";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";

const ListTrainingProgramPage = () => {
    const data = [
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
    ];

    const [trainingPrograms, setTrainingPrograms] = useState([]);
    useEffect(() => {
         axios.get("/training-programs")
             .then((res) => {
                 console.log(res.data)
                 setTrainingPrograms(res.data)
             })
    }, [])

    return (
        <>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={trainingPrograms.training_programs}
                renderItem={item => (
                    <List.Item>
                        <Card
                            hoverable
                            actions={[
                                <SettingOutlined key="setting" />,
                                <EditOutlined key="edit" />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                            title={item.vn_name}
                        >
                            Card content
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default ListTrainingProgramPage;