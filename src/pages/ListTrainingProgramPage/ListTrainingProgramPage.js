import {Badge, Button, Card, Descriptions, List, message, Modal, Popconfirm, Table, Tag} from "antd";
import React, {useEffect, useState} from 'react'
import axios from "axios";
import {
    BuildOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined, InfoCircleOutlined, InsertRowBelowOutlined,
    LockOutlined,
    PlusOutlined,
    SelectOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Cookies from "universal-cookie";
import * as actions from "../../redux/actions";
import './ListTrainingProgramPage.css'
import Icon from "@ant-design/icons/es";


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
                    training.learning_outcomes.forEach((locOfTraining) => {
                        let clo = locOfTraining.clos.find((c) => c.uuid === loc.uuid);

                        if (clo) {
                            clo.outlines.forEach(outline => {
                                const {course_code} = outline.course;
                                const {level} = outline.outline_learning_outcome;


                                data = [...data, <div>{`${course_code} (${level})`}</div>]
                            })
                        }
                    })
                    return data
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

const ListCourseOfTraining = ({visibleCourseList, setVisibleCourseList, trainingItem}) => {
    const history = useHistory();

    const columns = [
        {
            title: "Mã học phần",
            dataIndex: "course_code",
            key: "course_code"
        },
        {
            title: "Tên học phần",
            children: [
                {
                    title: "Tên học phần (vi)",
                    dataIndex: "course_name_vi",
                    key: "course_name_vi"
                },
                {
                    title: "Tên học phần (en)",
                    dataIndex: "course_name_en",
                    key: "course_name_en"
                }
            ]
        },
        {
            title: "Số tín chỉ",
            dataIndex: "credits",
            key: "credits"
        },
        {
            title: "Đề cương",
            render: (_, record) => {
                return (
                    <a>
                        <Tag
                            icon={<InfoCircleOutlined/>}
                            color="#87d068"
                            onClick={() => history.push(`/uet/courses/${record.uuid}/outlines`)}>
                            Đề cương
                        </Tag>
                    </a>
                )
            }
        }
    ]
    return (
        <>
            <Modal
                visible={visibleCourseList}
                title={`Danh sách học phần - ${trainingItem ? trainingItem.vn_name : ""}`}
                okText="OK"
                className="modal-courses-training"
                onCancel={() => {
                    setVisibleCourseList(false);
                }}
                onOk={() => {
                    setVisibleCourseList(false);
                }}
            >
                <Table
                    columns={columns}
                    dataSource={trainingItem ? trainingItem.courses : []}
                    bordered
                    pagination={false}
                />


            </Modal>
        </>
    )
}

const ListTrainingProgramPage = () => {
    const history = useHistory();

    const {currentUser, userRole} = useSelector(state => state.auth);
    const [trainingPrograms, setTrainingPrograms] = useState(null);
    const dispatch = useDispatch();
    const [visibleCourseMatrix, setVisibleCourseMatrix] = useState(false);
    const [visibleLocMatrix, setVisibleLocMatrix] = useState(false);
    const {user} = useSelector(state => state.accounts)

    const [visibleCourseList, setVisibleCourseList] = useState(false);
    const [chosenTraining, setChosenTraining] = useState(null);

    const getAllTrainingProgram = () => {
        axios.get("/training-programs")
            .then((res) => {
                setTrainingPrograms(res.data.training_programs)
            })
            .catch(err => {

            })
    }

    useEffect(() => {
        getAllTrainingProgram();
    }, [])


    const studentJoinTraining = (training) => {
        axios.post("/students/training-program/follow", {
            studentUuid: user.uuid,
            trainingProgramUuid: training.uuid
        }).then((res) => {
        })

    }

    const studentUnjoinTraining = (training) => {
        axios.post("/students/training-program/unfollow", {
            studentUuid: user.uuid,
            trainingProgramUuid: training.uuid
        }).then((res) => {
            getAllTrainingProgram()
        })

    }

    const onLock = async (uuid) => {
        try {
            const response = await axios.put(`/training-programs/${uuid}`, {lock_edit: 1})
            console.log(response.status)
            message.success("Đã khóa chương trình đào tạo");
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }

    const onDeleteTrainingProgram = (uuid) => {
        console.log("deleted")
    }


    const actionStudent = (item, isFollow) => {

        return [
            <SelectOutlined
                key="select"
                onClick={() => {
                    if (!isFollow)
                        return studentJoinTraining(item)
                    else
                        return studentUnjoinTraining(item)
                }}
            />,
            <Icon
                component={()=><i className="fas fa-th-list" />}
                key="setting"
                onClick={() => {
                    setChosenTraining(item);
                    setVisibleCourseList(true)
                }}
            />,
        ]
    }

    const actionAdmin = (item) => [
        <Link to={`/uet/training-programs/updating/${item.uuid}`}>
            <EditOutlined key="edit"/>
        </Link>,
        <Popconfirm
            title="Sau khi khóa sẽ không thể chỉnh sửa?"
            cancelText="Hủy"
            okText="Khóa"
            onConfirm={() => onLock(item.uuid)}
        >
            <LockOutlined/>
        </Popconfirm>,
        <Popconfirm
            title="Xóa CTĐT?"
            cancelText="Hủy"
            okText="Xóa"
            onConfirm={() => onDeleteTrainingProgram(item.uuid)}
        >
            <DeleteOutlined/>
        </Popconfirm>,
        ,
    ]

    const TrainingItem = ({item, isFollow}) => {

        return (
            <Card
                extra={<Link to={`/uet/training-programs/${item.uuid}`}>Chi tiết</Link>}
                actions={
                    userRole == 0 ? actionAdmin(item) : (userRole == 3 ? actionStudent(item, isFollow) : "")
                }
                title={item.vn_name}
            >
                <Descriptions column={1}>
                    <Descriptions.Item label="Số học phần">
                        {
                            item.courses.length
                        }
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        )
    }

    const ButtonActions = (
        <>
            <Button
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
            />
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


    return trainingPrograms ? (
        <>
            <List
                grid={{
                    gutter: 30,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 3,
                    xxl: 4,
                }}
                dataSource={trainingPrograms}
                renderItem={item => {
                        return <List.Item>
                            <TrainingItem item={item}/>
                        </List.Item>
                    }

                }
            />
            <MatrixCourses
                visibleCourseMatrix={visibleCourseMatrix}
                setVisibleCourseMatrix={setVisibleCourseMatrix}
                trainingList={trainingPrograms}
            />
            <MatrixLoc
                visibleLocMatrix={visibleLocMatrix}
                setVisibleLocMatrix={setVisibleLocMatrix}
                trainingList={trainingPrograms}
            />
            <ListCourseOfTraining
                visibleCourseList={visibleCourseList}
                setVisibleCourseList={setVisibleCourseList}
                trainingItem={chosenTraining}
            />
            {userRole == 0 ? ButtonActions : ""}
        </>
    ) : ""
}

export default ListTrainingProgramPage;
