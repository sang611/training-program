import {Button, Card, List, message, Modal, Popconfirm, Table} from "antd";
import React, {useEffect, useState} from 'react'
import axios from "axios";
import {
    BuildOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined, InsertRowBelowOutlined,
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

const cookies = new Cookies();

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
                    if(courseOfTraining)  {
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
                            course.key=index;
                            course.stt=index+1;
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

                        if(clo) {
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

const ListTrainingProgramPage = () => {
    const history = useHistory();

    const {currentUser, userRole} = useSelector(state => state.auth);
    const [trainingPrograms, setTrainingPrograms] = useState(null);
    const dispatch = useDispatch();
    const [visibleCourseMatrix, setVisibleCourseMatrix] = useState(false);
    const [visibleLocMatrix, setVisibleLocMatrix] = useState(false);




    useEffect(() => {
         axios.get("/training-programs")
             .then((res) => {
                 setTrainingPrograms(res.data.training_programs)
             })

    }, [])


    const studentJoinTraining = (training) => {
        axios.post("/students/training-program/follow", {
            studentUuid: currentUser.student.uuid,
            trainingProgramUuid: training.uuid
        }).then((res) => {
            message.success(res.data.message);
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



    const actionStudent = (item) => [
        <SelectOutlined key="select" onClick={() => studentJoinTraining(item)} />,
        <SettingOutlined key="setting" onClick={() => console.log("setting")} />,
    ]

    const actionAdmin = (item) => [
        <Link to={`/uet/training-programs/updating/${item.uuid}`}>
            <EditOutlined key="edit" />
        </Link>,
        <Popconfirm
            title="Sau khi khóa sẽ không thể chỉnh sửa?"
            cancelText="Hủy"
            okText="Khóa"
            onConfirm={()=>onLock(item.uuid)}
        >
            <LockOutlined />
        </Popconfirm>,
        <Popconfirm
            title="Xóa CTĐT?"
            cancelText="Hủy"
            okText="Xóa"
            onConfirm={()=>onDeleteTrainingProgram(item.uuid)}
        >
            <DeleteOutlined />
        </Popconfirm>,
        ,
    ]

    const TrainingItem = ({item}) => {
        return (
            <Card
                extra={<Link to={`/uet/training-programs/${item.uuid}`}>Chi tiết</Link>}
                actions={
                    userRole == 0 ? actionAdmin(item) : ( userRole == 3 ? actionStudent(item) : "")
                }
                title={item.vn_name}
            >
                Card content
            </Card>
        )
    }

    const ButtonActions = (
        <>
            <Button
                type="primary"
                shape="circle"
                icon={<BuildOutlined />}
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
                icon={<InsertRowBelowOutlined />}
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
                grid={{ gutter: 16, column: 3 }}
                dataSource={trainingPrograms}
                renderItem={item => (
                    <List.Item>
                        <TrainingItem item={item} />
                    </List.Item>
                )}
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
            {userRole == 0 ? ButtonActions : ""}
        </>
    ) : ""
}

export default ListTrainingProgramPage;
