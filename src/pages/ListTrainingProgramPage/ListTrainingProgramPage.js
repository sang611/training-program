import {Button, Card, Col, Descriptions, Divider, List, message, Modal, Popconfirm, Row, Spin, Table} from "antd";
import React, {useEffect, useState} from 'react'
import axios from "axios";
import {
    BuildOutlined,
    DeleteOutlined,
    EditOutlined, InfoOutlined,
    InsertRowBelowOutlined,
    LockOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import './ListTrainingProgramPage.css'
import Icon from "@ant-design/icons/es";
import Search from "antd/lib/input/Search";
import Text from "antd/es/typography/Text";
import Title from "antd/lib/typography/Title";
import TrainingProgramItem from "./TrainingProgramItem";


const MatrixCourses = ({visibleCourseMatrix, setVisibleCourseMatrix, trainingList}) => {
    const dispatch = useDispatch();
    const {courses} = useSelector(state => state.courses)
    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt'
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code'
        },
        {
            title: 'Tên học phần',
            dataIndex: 'course_name_vi'
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits'
        }
    ].concat(
        trainingList.map((training, index) => {
            return {
                title: training.vn_name,
                render: (_, course) => {
                    const courseOfTraining = training.courses.find((c) => c.uuid === course.uuid);
                    if (courseOfTraining) {
                        return courseOfTraining.training_program_course.course_type;
                    }
                }
            }
        })
    )

    return (
        <>
            <Modal
                visible={visibleCourseMatrix}
                title="Ma trận học phần"
                okText="OK"
                className="modal-courses"
                onCancel={() => {
                    setVisibleCourseMatrix(false);
                }}
                onOk={() => {
                    setVisibleCourseMatrix(false);
                }}
                footer={null}
            >
                <Table
                    columns={columns}
                    bordered
                    pagination={false}
                    dataSource={
                        courses.map((course, index) => {
                            course.key = index;
                            course.stt = index + 1;
                            return course;
                        })
                    }
                >

                </Table>
            </Modal>
        </>
    )
}

const MatrixLoc = ({visibleLocMatrix, setVisibleLocMatrix, trainingList}) => {

    const dispatch = useDispatch();
    const {locs} = useSelector(state => state.learningOutcomes)

    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes({typeLoc: 0}));
    }, [])

    const columns = [
        {
            title: 'Chuẩn đầu ra',
            dataIndex: 'content',
            width: '50%'
        }
    ].concat(
        trainingList.map((training, index) => {
            return {
                title: training.vn_name,
                render: (_, loc) => {
                    let data = [];
                    let courseCodesOfTraining = training.courses.map(course => course.course_code)
                    training.learning_outcomes.forEach((locOfTraining) => {
                        if(locOfTraining.uuid === loc.uuid) {
                            let clos = locOfTraining.clos;
                            clos.forEach(clo => {
                                let outlines = clo.outlines;
                                outlines.forEach((outline) => {
                                    if(courseCodesOfTraining.includes(outline.course.course_code)){
                                        let course_level = (

                                                `${outline.course.course_code} (${outline.outline_learning_outcome.level})`

                                        )
                                        if(!data.includes(course_level)) {
                                            data.push(course_level);
                                        }

                                    }
                                })
                            })
                        }
                    })
                    return data.map(d => (
                        <div>{d}</div>
                    ))
                }
            }
        })
    )

    return (
        <>
            <Modal
                visible={visibleLocMatrix}
                title="Ma trận chuẩn đầu ra"
                okText="OK"
                className="modal-locs"
                onCancel={() => {
                    setVisibleLocMatrix(false);
                }}
                onOk={() => {
                    setVisibleLocMatrix(false);
                }}
                footer={null}
            >
                <Table
                    columns={columns}
                    bordered
                    pagination={false}
                    dataSource={
                        locs.map((loc, index) => {
                            loc.key = index;
                            return loc;
                        })
                    }
                >

                </Table>
            </Modal>

        </>
    )
}



const ListTrainingProgramPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {userRole} = useSelector(state => state.auth);
    const {trainingPrograms, loadingAllTrainings, errors} = useSelector(state => state.trainingPrograms)
    const [visibleCourseMatrix, setVisibleCourseMatrix] = useState(false);
    const [visibleLocMatrix, setVisibleLocMatrix] = useState(false);

    const [vnNameSearch, setVnNameSearch] = useState("");


    useEffect(() => {
        dispatch(actions.getAllTrainingProgram({
            vnNameSearch
        }));
    }, [vnNameSearch])




    const ButtonActions = (
        <>
            {/*<Button
                type="primary"
                shape="circle"
                icon={<BuildOutlined/>}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 132
                }}
                onClick={() => {
                    setVisibleLocMatrix(true);
                }}
            />
            <Button
                type="primary"
                shape="circle"
                icon={<InsertRowBelowOutlined/>}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 82
                }}
                onClick={() => {
                    setVisibleCourseMatrix(true);
                }}
            />*/}
            <Button
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
            />
        </>
    )


    return  (
        !errors ?
            <>
                <Row align="middle" justify="end">
                    <Col span={10}>
                        <Search
                            placeholder="Tìm kiếm chương trình đào tạo"
                            enterButton
                            size="large"
                            onChange={(e) => setVnNameSearch(e.target.value)}
                        />
                    </Col>
                </Row>
                <Divider orientation="left">
                    <Text type="danger">
                        <i>
                            {`${trainingPrograms.length} chương trình đào tạo`}
                        </i>
                    </Text>
                </Divider>
                {
                    loadingAllTrainings == false ?
                        (
                            <List
                                grid={{
                                    gutter: 30,
                                    xs: 1,
                                    sm: 2,
                                    md: 2,
                                    lg: 3,
                                    xl: userRole > 0 ? 4 : 3,
                                    xxl: 4,
                                }}
                                dataSource={trainingPrograms}
                                renderItem={item => {
                                    return <List.Item>
                                        <TrainingProgramItem
                                            item={item}
                                            userRole={userRole}
                                            vnNameSearch={vnNameSearch}
                                        />
                                    </List.Item>
                                }

                                }
                            />
                        ) : <Spin />
                }

                {userRole == 0 ? ButtonActions : ""}
            </> : <div>{errors.toString()}</div>
    )
}

export default ListTrainingProgramPage;
