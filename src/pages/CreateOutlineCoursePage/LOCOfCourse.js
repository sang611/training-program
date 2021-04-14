import {useState, useEffect, useRef, useMemo} from 'react';
import {Cascader, Col, Form, Input, InputNumber, Row, Table} from "antd";
import * as actions from '../../redux/actions'
import {useDispatch, useSelector} from "react-redux";
import React, {createContext, useContext} from "react";

const CLO = ({setLoc, learning_outcomes}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const {locs} = useSelector(state => state.learningOutcomes);

    const [cloSelected, setCloSelected] = useState([]);


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
            render: (text, record) => {
                if(!learning_outcomes) {record.level=1}
                else {
                    let cloMatch = learning_outcomes.find(loc => loc.uuid == record.uuid);
                    if(cloMatch) {
                        record.level = cloMatch.outline_learning_outcome.level;
                    }
                    else {
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
            <Table
                columns={columnCLOs}
                bordered
                rowSelection={rowSelection}
                dataSource={locs ? locs.map(clo => {
                    clo.key = clo.uuid;
                    return clo;
                }) : []}
            />
        </>
    )
}


const LOCOfCourse = ({setLoc, learning_outcomes}) => {
    return (
        <>
            <Row>
                <Col span={12}>
                    <CLO setLoc={setLoc} learning_outcomes={learning_outcomes}/>
                </Col>
            </Row>

        </>
    )
}

export default LOCOfCourse;
