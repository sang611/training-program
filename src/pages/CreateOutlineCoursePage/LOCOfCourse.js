import {useState, useEffect, useRef, useMemo} from 'react';
import {Cascader, Col, Form, Input, InputNumber, Row, Table} from "antd";
import * as actions from '../../redux/actions'
import {useDispatch, useSelector} from "react-redux";
import React, {createContext, useContext} from "react";


const PLO = ({clos, setClos}) => {
    const [ploSelected, setPloSelected] = useState(null);
    const {locs} = useSelector(state => state.learningOutcomes);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes({typeLoc: 0}))
    }, [])

    useEffect(() => {
        setClos(locs
            .filter((loc) => loc.category === 2 && !loc.isLink))
    }, [locs])

    const columnPLOs = [
        {
            title: "Chuẩn đầu ra của CTĐT",
            dataIndex: "content",
            key: "uuid",
            render: (_, record) => {
                return (ploSelected && ploSelected === record.uuid && clos) ?
                    <b>
                        {record.content}
                    </b> : record.content
            }
        }
    ]
    return (

        <Table
            columns={columnPLOs}
            bordered
            dataSource={locs.filter((loc) => loc.category === 1).map((loc) => {
                loc.key = loc.uuid;
                return loc;
            })}
            onRow={(record, rowIndex) => {
                return {
                    onClick: event => {
                        setPloSelected(record.uuid);
                        setClos(record.clos)
                    },
                };
            }}
            onHeaderRow={(columns, index) => {
                return {
                    onClick: () => {
                        setClos(locs
                            .filter((loc) => loc.category === 2 && !loc.isLink))
                    },
                };
            }}
        />

    )
}

const CLO = ({clos, setClos, setLoc, learning_outcomes}) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const {locs} = useSelector(state => state.learningOutcomes);

    const [cloSelected, setCloSelected] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {

        if(learning_outcomes) {
            if(clos) {
                setDataSource(
                    clos.map((clo) => {
                        clo.key = clo.uuid;
                        learning_outcomes.forEach((loc) => {
                            if(clo.uuid === loc.uuid)
                                clo.level = loc.outline_learning_outcome.level;
                        })
                        console.log(clo.level)
                        return clo;
                    })
                )
            }
        }
        else {
            setDataSource(clos);
        }

    }, [clos, locs])

    useEffect(() => {
        if (learning_outcomes) {
            setCloSelected(learning_outcomes)
        }
    }, [])

    useEffect(() => {

        setSelectedRowKeys(
            cloSelected.map((clo) => clo.uuid)
        )

    }, [clos, cloSelected])

    useEffect(() => {
        console.log(cloSelected);
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
                if(!record.level) {record.level=1}
                return (
                    <InputNumber
                        size="small"
                        min={1}
                        max={4}
                        defaultValue={record.level}
                        style={{width: 50}}
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
        console.log(selectedRowKeys)
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
                dataSource={dataSource ? dataSource.map(clo => {
                    clo.key = clo.uuid;
                    return clo;
                }) : []}
            />
        </>
    )
}


const LOCOfCourse = ({setLoc, learning_outcomes}) => {
    const [clos, setClos] = useState(null);
    return (
        <>
            <Row>
                <Col span={12}>
                    <PLO clos={clos} setClos={setClos}/>
                </Col>
                <Col span={12}>
                    <CLO clos={clos} setClos={setClos} setLoc={setLoc} learning_outcomes={learning_outcomes}/>
                </Col>
            </Row>

        </>
    )
}

export default LOCOfCourse;