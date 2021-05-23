import React, {useEffect, useState} from 'react';
import {Col, Input, InputNumber, Pagination, Row, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {Option} from "antd/lib/mentions";
import * as actions from "../../redux/actions";

const CLO = ({setLoc, learning_outcomes}) => {
    console.log("re render")
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const {locs, total} = useSelector(state => state.learningOutcomes);
    const dispatch = useDispatch();

    const [content, setContent] = useState("");
    const [title, setTitle] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [cloSelected, setCloSelected] = useState([]);

    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes({typeLoc: 2, content, page: currentPage, title}));
    }, [content, currentPage, title])

    useEffect(() => {
        if (learning_outcomes) {
            setCloSelected(learning_outcomes)
        }
    }, [])

    useEffect(() => {
        setSelectedRowKeys(
            cloSelected.map((clo) => clo.uuid)
        )
    }, [cloSelected])

    useEffect(() => {
        setLoc(cloSelected)
    }, [cloSelected])

    const columnCLOs = [
        {
            title: "Chuẩn đầu ra của học phần",
            dataIndex: "content",
            key: "uuid"
        },
        {
            title: 'Bậc',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            render: (text, record) => {
                if (!learning_outcomes) {
                    record.level = 1
                } else {
                    let cloMatch = learning_outcomes.find(loc => loc.uuid == record.uuid);
                    if (cloMatch) {
                        record.level = cloMatch.outline_learning_outcome.level;
                    } else {
                        record.level = 1;
                    }

                }
                return (
                    <InputNumber
                        size="small"
                        min={1}
                        max={6}
                        defaultValue={record.level}
                        style={{width: 60}}
                        onChange={
                            (val) => {
                                record.level = val;
                                cloSelected.forEach((clo) => {
                                    if (clo.uuid === record.uuid) {
                                        if (!clo.level) {
                                            clo.outline_learning_outcome.level = record.level;
                                        } else {
                                            clo.level = record.level;
                                        }
                                    }
                                })
                            }
                        }
                    />
                )
            },
        },
    ]
    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const onSelectAllClo = (selected, selectedRow, changeRows) => {
        setCloSelected(selectedRow)
    };

    const onSelectClo = (record, selected) => {
        if (selected) {
            setCloSelected([...cloSelected, record])
        } else {
            setCloSelected(
                cloSelected.filter((clo) => clo.uuid !== record.uuid)
            )
        }
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        onSelect: onSelectClo,
        onSelectAll: onSelectAllClo
    };

    return (
        <>
            <Row>
                <Col span={12}>
                    <Row>
                        <Col span={6}>
                            <Select
                                onChange={(val) => setTitle(val)}
                                size="large"
                                placeholder="Nhóm"
                                //value={title}
                                style={{width: '100%'}}
                            >
                                <Option key={0} value={0}>Tất cả</Option>
                                <Option key={1} value={1}>Kiến thức</Option>
                                <Option key={2} value={2}>Kĩ năng</Option>
                                <Option key={3} value={3}>Thái độ</Option>
                            </Select>
                        </Col>
                        <Col span={18}>
                            <Input
                                placeholder="Tìm kiếm"
                                onChange={(e) => {
                                    setContent(e.target.value)
                                    setCurrentPage(1);
                                }}
                                value={content}
                                style={{width: '100%'}}
                                size="large"/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br/>
            <Table
                columns={columnCLOs}
                bordered
                pagination={false}
                rowSelection={rowSelection}
                dataSource={locs ? locs.map(clo => {
                    clo.key = clo.uuid;
                    return clo;
                }) : []}
            />
            <br/>
            <Row justify="end">
                <Pagination
                    current={currentPage}
                    total={total}
                    onChange={(val) => setCurrentPage(val)}
                    showSizeChanger={false}
                />
            </Row>
        </>
    )
}


const LOCOfCourse = ({setLoc, learning_outcomes}) => {
    return (
        <>
            <Row>
                <Col span={20}>
                    <CLO setLoc={setLoc} learning_outcomes={learning_outcomes}/>
                </Col>
            </Row>

        </>
    )
}

export default LOCOfCourse;
