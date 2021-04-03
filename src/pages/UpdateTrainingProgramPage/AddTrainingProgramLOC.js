import {Button, Col, Drawer, Form, Input, message, Pagination, Radio, Row, Select, Space, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import React, {useEffect, useState} from 'react'
import axios from "axios";
import Checkbox from "antd/es/checkbox/Checkbox";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import CreatePLO from "../LearningOutcomePage/CreatePLO";
import {Option} from "antd/lib/mentions";
import learningOutcomes from "../../redux/reducers/learningOutcomes";


const ListLocs = ({trainingProgram}) => {
    const [locs, setLocs] = useState([]);
    const [choosedLocs, setChoosedLocs] = useState([]);
    const dispatch = useDispatch();
    const state = useSelector(state => state.learningOutcomes);

    const [content, setContent] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [title, setTitle] = useState(0);

    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes({typeLoc: 1, content, page: currentPage, title}));
    }, [content, currentPage, title])

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
            setChoosedLocs(
                [...trainingProgram.learning_outcomes.map((loc) => loc.uuid)]
            )
    }, [])

    useEffect(() => {
        console.log(choosedLocs)
        setSelectedRowKeys(choosedLocs);
    }, [choosedLocs])


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
            if(selected) {
                setChoosedLocs([...choosedLocs, record.uuid])
            } else {
                setChoosedLocs(
                    choosedLocs.filter(locUuid => locUuid !== record.uuid)
                )
            }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },

        selectedRowKeys: selectedRowKeys
    };


    const onAddLocsToTrainingProgram = () => {

        if(choosedLocs.length > 0) {
            axios.post("/training-programs/learning-outcomes", {
                trainingUuid: trainingProgram.uuid,
                locs: selectedRowKeys
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
        <Row justify="end">
            <Col span={14}>
                <Pagination
                    current={currentPage}
                    total={state.total}
                    onChange={(val) => setCurrentPage(val)}
                    />
            </Col>
            <Col span={10}>
                <Row>

                    <Col span={7}>
                        <Select
                            onChange={(val) => setTitle(val)}
                            size="large"
                            defaultValue={0}
                            style={{width: '100%'}}
                        >
                            <Option key='all' value={0}>Tất cả</Option>
                            <Option key='kien_thuc' value={1}>Kiến thức</Option>
                            <Option key='ki_nang' value={2}>Kĩ năng</Option>
                            <Option key='dao_duc' value={3}>Đạo đức</Option>
                        </Select>
                    </Col>
                    <Col span={17}>
                        <Input
                            placeholder="Tìm kiếm"
                            onChange={(e) => {
                                setContent(e.target.value)
                                setCurrentPage(1);
                            }}
                            style={{width: '100%'}}
                            size="large"/>
                    </Col>


                </Row>


            </Col>
        </Row><br/>
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
