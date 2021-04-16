import {Table} from "antd";
import React from "react";
import Title from "antd/lib/typography/Title";

const TrainingLOC = ({learning_outcomes}) => {

    const columns = [
        {
            title: 'Nội dung',
            dataIndex: 'content',
            ellipsis: true,
            key: 'content',
        },
    ];

    return (
        <>
            <Title level={3}>
                II. Chuẩn đầu ra của CTĐT
            </Title>
            <Table
                pagination={false}
                columns={columns}
                dataSource={learning_outcomes}
                expandable={{indentSize: 40}}
            />
        </>
    )

}

export default TrainingLOC;