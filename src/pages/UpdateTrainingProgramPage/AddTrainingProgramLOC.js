import {Button, Col, Drawer, Form, Input, message, Row, Space, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import {useEffect, useState} from 'react'
import axios from "axios";
import Checkbox from "antd/es/checkbox/Checkbox";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import CreatePLO from "../LearningOutcomePage/CreatePLO";


const ListLocs = ({trainingProgram}) => {
    const [locs, setLocs] = useState([]);
    const [choosedLocs, setChoosedLocs] = useState([]);
    const dispatch = useDispatch();
    const state = useSelector(state => state.learningOutcomes);

    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes({typeLoc: 1}));
    }, [])

    useEffect(() => {
        state.locs.forEach((loc) => {
            loc.key = loc.uuid;
        })

        setLocs(
            state.locs.filter((loc) => {
                return loc.parent_uuid == null;
            })
        );
    }, [state])


    const columns = [
        {
            title: 'Nội dung chuẩn đầu ra',
            dataIndex: 'content',
            key: 'content',
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    useEffect(() => {
        if (trainingProgram.learning_outcomes)
            setSelectedRowKeys(
                trainingProgram.learning_outcomes.map((loc) => loc.uuid)
            )
    }, [])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setChoosedLocs(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys)
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },

        selectedRowKeys: selectedRowKeys
    };


    const onAddLocsToTrainingProgram = () => {
        console.log(choosedLocs)
        if(choosedLocs.length > 0) {
            axios.post("/training-programs/learning-outcomes", {
                trainingUuid: trainingProgram.uuid,
                locs: choosedLocs
            })
                .then((res) => {message.success("Cập nhật CĐR thành công")})
                .catch((e) => {message.error(e.response.data.message)})
        }

    }

    const [parentOutcome, setParentOutcome] = useState(null);
    const [visibleDrawer, setVisibleDrawer] = useState(false);

    const showDrawer = () => {
        setVisibleDrawer(true)
    };
    const onCloseDrawer = () => {
        setVisibleDrawer(false);
    };

    const checkStrictly = true;

    const Footer = () => {
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Button type="primary" onClick={onAddLocsToTrainingProgram}>Cập nhật</Button>
                    </Col>
                    <Col>
                        <Button type="primary" danger onClick={showDrawer}>Tạo mới CĐR</Button>
                    </Col>
                </Row>

            </>
        )
    }

    return <>
        <Table
            loading={state.loading}
            pagination={false}
            columns={columns}
            dataSource={locs}
            rowSelection={{...rowSelection, checkStrictly}}
            expandable={{indentSize: 40}}
            footer={()=><Footer />}
        />
        <Drawer
            title={`Thêm mới chuẩn đầu ra: ${parentOutcome ? parentOutcome.content : ""}`}
            width={720}
            onClose={onCloseDrawer}
            visible={visibleDrawer}
            bodyStyle={{paddingBottom: 80}}
        >
            <CreatePLO />
        </Drawer>

    </>
}


const AddTrainingProgramLOC = ({trainingProgram}) => {

    return (
        <>
            <ListLocs trainingProgram={trainingProgram}/>

        </>
    )
}

export default AddTrainingProgramLOC;
