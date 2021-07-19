import {Col, message, Modal, Popconfirm, Row, Skeleton, Space, Table, Tag, Tooltip} from "antd";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import {Link} from "react-router-dom";
import {BuildOutlined, DeleteOutlined, EditOutlined, InsertRowBelowOutlined, UnlockOutlined} from "@ant-design/icons";
import Icon from "@ant-design/icons/es";
import {generateDataFrame} from "../../utils/frameCourse";
import SearchCourseFrameComponent from "../UpdateTrainingProgramPage/SearchCourseFrameComponent";
import {useEffect, useState} from "react";

const ListCourseOfTraining = ({visibleCourseList, setVisibleCourseList, trainingItem}) => {
    const [knowledgeType, setKnowledgeType] = useState("ALL");
    const {coursesMatrixTraining, requireSummary, loadingCoursesMatrix} = useSelector(state => state.trainingPrograms);
    const [data, setData] = useState(
        generateDataFrame({
            courses: coursesMatrixTraining,
            require_summary: requireSummary
        })
    );
    let indexRow = 1;
    const dispatch = useDispatch();

    useEffect(() => {
        if (visibleCourseList) {
            dispatch(actions.getCourseOfMatrixTrainingProgram({id: trainingItem.uuid}))
        }

    }, [visibleCourseList])

    useEffect(() => {
        setData(
            generateDataFrame({
                courses: coursesMatrixTraining,
                require_summary: requireSummary
            })
        )
    }, [coursesMatrixTraining])

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => {
                return record.uuid ? indexRow++ : '';
            },
            key: "stt"
        },
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
                    key: "course_name_vi",
                    render: (_, course) => {
                        if (course.uuid) {
                            return (
                                <>
                                    <div>{course.course_name_vi}</div>
                                    <div>
                                        <i>{course.course_name_en}</i>
                                    </div>
                                </>
                            )
                        } else {
                            if (course.h === 1)
                                return <b>{course.course_name_vi}</b>
                            else if (course.h === 2)
                                return <span style={{fontWeight: 500}}><i>{course.course_name_vi}</i></span>
                        }
                    }
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
            key: "credits",
            render: (_, course) => {
                if (course.uuid) return course.credits;
                else return <b>{course.credits}</b>
            }
        },
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
                footer={null}
            >
                {
                    loadingCoursesMatrix ? <Skeleton/> :

                        <Row>
                            <Col span={22} offset={1}>}
                                <SearchCourseFrameComponent
                                    setDataSource={setData}
                                    trainingProgram={
                                        {
                                            courses: coursesMatrixTraining,
                                            require_summary: requireSummary
                                        }
                                    }
                                />
                                <Table
                                    columns={columns}
                                    dataSource={
                                        data
                                    }
                                    bordered
                                    pagination={false}
                                />
                            </Col>
                        </Row>

                }

            </Modal>
        </>
    )
}

const MatrixLearningOutcomes = ({trainingItem, visibleLocMatrix, setVisibleLocMatrix}) => {
    const dispatch = useDispatch();
    const {locsMatrixTraining, loadingLocsMatrix} = useSelector(state => state.trainingPrograms)
    const {coursesMatrixTraining, loadingCoursesMatrix} = useSelector(state => state.trainingPrograms)

    useEffect(() => {
        if (visibleLocMatrix) {
            dispatch(actions.getLocOfTrainingProgram({id: trainingItem.uuid}))
            dispatch(actions.getCourseOfMatrixTrainingProgram({id: trainingItem.uuid}))
        }

    }, [visibleLocMatrix])


    let levelLocs = locsMatrixTraining.map(loc => ({
        locUuid: loc.uuid,
        levels: []
    }))

    const columns = [
        {
            title: 'CĐR/HP',
            dataIndex: 'content',
            fixed: 'left',
            width: 280
        }
    ].concat(
        coursesMatrixTraining.map(course => {
            return {
                title: course.course_name_vi,
                render: (_, loc) => {
                    let outline;
                    if (trainingItem.lock_edit) {
                        outline = course.outlines ? course.outlines.find(outline => outline.uuid === course.training_program_course.outlineUuid) : null;
                    } else {
                        outline = course.outlines[0] ? course.outlines[0] : null
                    }
                    if (outline) {
                        let locsOfCourse = outline.learning_outcomes;

                        let clos = loc.clos.map(clo => clo.uuid);

                        let point = 0;
                        let num = 0;

                        locsOfCourse.forEach(locOfCourse => {
                            if (clos.includes(locOfCourse.uuid)) {
                                point += locOfCourse.outline_learning_outcome.level;
                                num++;
                            }
                        })

                        if (point > 0) {
                            let levelLoc = levelLocs.find(levelLoc => levelLoc.locUuid === loc.uuid)

                            if (!levelLoc.levels.map(level => level.course).includes(course.uuid)) {
                                levelLoc.levels.push({course: course.uuid, point})
                            }

                            return point / num;
                        }

                        return "";
                    }
                    return ""
                }
            }
        })
            .concat(
                [
                    {
                        title: 'Tổng môn',
                        dataIndex: 'num_of_course',
                        fixed: 'right',
                        width: 80,
                        render: (_, loc) => {
                            let num = levelLocs.find(levelLoc => levelLoc.locUuid === loc.uuid).levels.length;
                            return num > 0 ? num : ''
                        }
                    },
                    {
                        title: 'Tổng điểm',
                        dataIndex: 'sum_of_level',
                        fixed: 'right',
                        width: 80,
                        render: (_, loc) => {
                            let summary = levelLocs
                                .find(levelLoc => levelLoc.locUuid === loc.uuid)
                                .levels
                                .reduce((a, b) => a + b.point, 0);
                            return summary > 0 ? summary : ''
                        }
                    },
                    {
                        title: 'Trung bình',
                        dataIndex: 'average_level',
                        fixed: 'right',
                        width: 80,
                        render: (_, loc) => {
                            let summary = levelLocs
                                .find(levelLoc => levelLoc.locUuid === loc.uuid)
                                .levels
                                .reduce((a, b) => a + b.point, 0);
                            let num = levelLocs.find(levelLoc => levelLoc.locUuid === loc.uuid).levels.length;
                            return summary > 0 && num > 0 ? (summary) / (num) : ''

                        }
                    }
                ]
            )
    )


    return (
        <Modal
            visible={visibleLocMatrix}
            title={`Ma trận chuẩn đầu ra chương trình đào tạo: ${trainingItem ? trainingItem.vn_name : ""}`}
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
            {
                (loadingLocsMatrix || loadingCoursesMatrix) ? <Skeleton/> :
                    <Table
                        columns={columns}
                        bordered
                        pagination={false}
                        dataSource={
                            locsMatrixTraining.map((loc, index) => {
                                loc.key = index;
                                return loc;
                            })
                        }

                        scroll={{x: 200 * coursesMatrixTraining.length, y: '65vh'}}
                    />
            }

        </Modal>
    )


}

const MatrixCourses = ({trainingItem, visibleCourseMatrix, setVisibleCourseMatrix}) => {
    const dispatch = useDispatch();
    const {coursesMatrixTraining, loadingCoursesMatrix} = useSelector(state => state.trainingPrograms);
    useEffect(() => {
        if (visibleCourseMatrix) {
            dispatch(actions.getCourseOfMatrixTrainingProgram({id: trainingItem.uuid}))
        }
    }, [visibleCourseMatrix])
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 100
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
            width: 250
        },
        {
            title: 'Tên học phần',
            dataIndex: 'course_name_vi'
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits'
        },
        {
            title: 'Loại học phần',
            dataIndex: ['training_program_course', 'course_type'],
            render: (_, course) => {
                switch (course.training_program_course.course_type) {
                    case 'B':
                        return "Bắt buộc"
                    case 'L':
                        return "Tự chọn"
                    case 'BT':
                        return "Bổ trợ"
                    case 'TACS':
                        return "Tiếng Anh cơ sở"
                    case 'KLTN':
                        return "Khóa luận tốt nghiệp"
                }
            }
        }
    ]
    return (
        <Modal
            visible={visibleCourseMatrix}
            title={`Danh sách học phần chương trình đào tạo: ${trainingItem ? trainingItem.vn_name : ""}`}
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
            {
                loadingCoursesMatrix ? <Skeleton/> :
                    <Table
                        columns={columns}
                        bordered
                        pagination={false}
                        dataSource={
                            coursesMatrixTraining.map((course, index) => {
                                course.key = course.uuid;
                                course.stt = index + 1;
                                return course;
                            })
                        }
                        scroll={{y: 500}}
                    />
            }
        </Modal>
    )
}

const TableThemeList = (vnNameSearch) => {
    const {trainingPrograms, loadingAllTrainings, errors} = useSelector(state => state.trainingPrograms)
    const [item, setItem] = useState();
    const {userRole} = useSelector(state => state.auth)


    const columns = [
        {
            title: "Ngành đào tạo",
            key: "vn_name",
            render: (_, item) => {
                return <>
                    <Link to={`/uet/training-programs/${item.uuid}`}>
                        {item.vn_name}
                    </Link>
                </>
            }
        },
        {
            title: "Hệ",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Năm áp dụng",
            dataIndex: "version",
            key: "version"
        },
        {
            title: "Số lớp áp dụng",
            render: (_, item) => {
                return item.classes ? JSON.parse(item.classes).length : 0
            }
        },
        {
            title: "Trạng thái",
            render: (_, item) => {
                return item.lock_edit ? "Đã ban hành" : "Chưa ban hành"
            }
        },
        {
            title: "Thao tác",
            render: (_, record) => {
                if (userRole === 0) {
                    if (!record.lock_edit) {
                        return (
                            <Space size="middle">
                                <Link to={`/uet/training-programs/updating/${record.uuid}`}>
                                    <Tooltip title="Chỉnh sửa" color="#108ee9">
                                        <EditOutlined key="edit"/>
                                    </Tooltip>
                                </Link>
                                <Tooltip title="Ma trận CĐR" color="#108ee9">
                                    <BuildOutlined onClick={() => {
                                        setItem(record)
                                        setVisibleLocMatrix(true)
                                    }}
                                                   style={{color: "#1890FF"}}
                                    />
                                </Tooltip>
                                <Tooltip title="Danh sách HP" color="#108ee9">
                                    <InsertRowBelowOutlined onClick={() => {
                                        setItem(record)
                                        setVisibleCourseMatrix(true)
                                    }}
                                                            style={{color: "#1890FF"}}
                                    />
                                </Tooltip>
                                <Popconfirm
                                    title="Sau khi khóa sẽ không thể chỉnh sửa?"
                                    cancelText="Hủy"
                                    okText="Khóa"
                                    onConfirm={() => {
                                        onLock(record.uuid)
                                    }}
                                >
                                    <Tooltip title="Khóa" color="#108ee9">
                                        <UnlockOutlined style={{color: "#1890FF"}}/>
                                    </Tooltip>
                                </Popconfirm>
                                <Popconfirm
                                    title="Xóa CTĐT?"
                                    cancelText="Hủy"
                                    okText="Xóa"
                                    onConfirm={() => {
                                        onDeleteTrainingProgram(record.uuid)
                                    }}
                                >
                                    <Tooltip title="Xóa" color="#108ee9">
                                        <DeleteOutlined style={{color: "#1890FF"}}/>
                                    </Tooltip>
                                </Popconfirm>

                            </Space>

                        )
                    } else {
                        return (
                            <Space size="middle">
                                <Tooltip title="Ma trận CĐR" color="#108ee9">
                                    <BuildOutlined onClick={() => {
                                        setItem(record)
                                        setVisibleLocMatrix(true)
                                    }}
                                                   style={{color: "#1890FF"}}
                                    />
                                </Tooltip>
                                <Tooltip title="Danh sách HP" color="#108ee9">
                                    <InsertRowBelowOutlined onClick={() => {
                                        setItem(record)
                                        setVisibleCourseMatrix(true)
                                    }}
                                                            style={{color: "#1890FF"}}
                                    />
                                </Tooltip>
                            </Space>
                        )
                    }
                } else if (userRole === 3) {
                    return (
                        <>
                            <Tooltip title="Danh sách học phần" color="#108ee9">
                                <Icon
                                    component={() => <i className="fas fa-th-list" style={{color: "#1890FF"}}/>}
                                    onClick={() => {
                                        setItem(record)
                                        setVisibleCourseList(true)
                                    }}
                                />
                            </Tooltip>
                        </>
                    )
                } else {
                    return (
                        <>
                            <Tooltip title="Danh sách học phần" color="#108ee9">
                                <Icon
                                    component={() => <i className="fas fa-th-list" style={{color: "#1890FF"}}/>}
                                    onClick={() => {
                                        setItem(record)
                                        setVisibleCourseList(true)
                                    }}
                                />
                            </Tooltip>,
                        </>
                    )
                }
            }
        },
    ]

    const [visibleCourseList, setVisibleCourseList] = useState(false);
    const [visibleLocMatrix, setVisibleLocMatrix] = useState(false);
    const [visibleCourseMatrix, setVisibleCourseMatrix] = useState(false);

    const {coursesMatrixTraining, loadingCoursesMatrix} = useSelector(state => state.trainingPrograms);
    const dispatch = useDispatch();

    const onLock = async (uuid) => {
        let course_outlines = [];
        for (let course of coursesMatrixTraining) {
            course_outlines.push({
                courseUuid: course.uuid,
                outlineUuid: course.outlines[0] ? course.outlines[0].uuid : ""
            })
        }
        try {
            await axios.put(`/training-programs/${uuid}/lock`, {
                course_outlines
            })
            message.success("Đã khóa chương trình đào tạo");
            dispatch(actions.getAllTrainingProgram({vnNameSearch: ""}));
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }

    const onUnLock = async (uuid) => {
        let course_outlines = [];
        for (let course of coursesMatrixTraining) {
            course_outlines.push({
                courseUuid: course.uuid,
                outlineUuid: course.outlines[0] ? course.outlines[0].uuid : ""
            })
        }
        try {
            await axios.put(`/training-programs/${uuid}/unlock`, {
                course_outlines
            })
            message.success("Đã mở khóa chương trình đào tạo");
            dispatch(actions.getAllTrainingProgram({vnNameSearch: ""}));
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }

    const onDeleteTrainingProgram = (uuid) => {
        axios.delete(`/training-programs/${uuid}`)
            .then(res => {
                message.success("Đã xóa chương trình đào tạo")
                dispatch(actions.getAllTrainingProgram({
                    vnNameSearch
                }));
            })
            .catch(e => {
                message.error("Không thể xóa chương trình đào tạo")
            })
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={trainingPrograms}
                bordered
            >

            </Table>
            <>
                <ListCourseOfTraining
                    visibleCourseList={visibleCourseList}
                    setVisibleCourseList={setVisibleCourseList}
                    trainingItem={item}
                />

                <MatrixLearningOutcomes
                    trainingItem={item}
                    visibleLocMatrix={visibleLocMatrix}
                    setVisibleLocMatrix={setVisibleLocMatrix}
                />

                <MatrixCourses
                    trainingItem={item}
                    visibleCourseMatrix={visibleCourseMatrix}
                    setVisibleCourseMatrix={setVisibleCourseMatrix}
                />
            </>
        </>

    )
}

export default TableThemeList;