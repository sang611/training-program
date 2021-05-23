import {Descriptions, Table} from "antd";
import React from "react";
import Title from "antd/lib/typography/Title";
import {locTypes} from "../../constants";

const LOCItems = ({learning_outcomes, title}) => {
    return (
        <Descriptions
            column={1}
            title={
                `${title}. Chuẩn đầu ra về ${
                    locTypes.find(type => type.value === title) ?
                        locTypes.find(type => type.value === title).content  : ""
                }`
            }
            colon={false}
        >
            {
                learning_outcomes
                    .filter(loc => loc.title === title)
                    .map(loc => (
                        <Descriptions.Item label="-" style={{paddingLeft: 30}}>
                            {loc.content}
                        </Descriptions.Item>
                    ))
            }
        </Descriptions>
    )
}

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
        <div id="training-loc">
            <Title level={4}>
                PHẦN II. CHUẨN ĐẦU RA CỦA CHƯƠNG TRÌNH ĐÀO TẠO
            </Title>
            {/*<Table
                pagination={false}
                columns={columns}
                dataSource={learning_outcomes}
                expandable={{indentSize: 40}}
            />*/}

            <LOCItems learning_outcomes={learning_outcomes} title={1}/>
            <LOCItems learning_outcomes={learning_outcomes} title={2}/>
            <LOCItems learning_outcomes={learning_outcomes} title={3}/>
        </div>
    )

}

export default TrainingLOC;