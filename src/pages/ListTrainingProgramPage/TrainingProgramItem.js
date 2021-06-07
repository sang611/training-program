import {Link} from "react-router-dom";
import {
    Button,
    Card,
    Col,
    Descriptions,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Skeleton,
    Space,
    Spin,
    Table
} from "antd";
import {
    BuildOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoOutlined,
    InsertRowBelowOutlined, LoadingOutlined,
    LockOutlined, UnlockOutlined
} from "@ant-design/icons";
import Icon from "@ant-design/icons/es";
import axios from "axios";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useMemo, useState} from "react";
import {generateDataFrame} from "../../utils/frameCourse";
import SearchCourseFrameComponent from "../UpdateTrainingProgramPage/SearchCourseFrameComponent";

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
                            <Col span={22} offset={1}>
                                {/*<Space align="baseline">
                                    <h4>
                                        Khối kiến thức:
                                    </h4>
                                    <Select
                                        placeholder="Khối kiến thức"
                                        optionFilterProp="children"
                                        style={{width: '150px'}}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={(val) => {
                                            setKnowledgeType(val)
                                        }}
                                    >
                                        <Select.Option value="ALL"
                                                       key={1}>Tất cả</Select.Option>
                                        <Select.Option value="C"
                                                       key={1}>Chung</Select.Option>
                                        <Select.Option value="LV"
                                                       key={2}>Lĩnh vực</Select.Option>
                                        <Select.Option value="KN"
                                                       key={3}>Khối ngành</Select.Option>
                                        <Select.Option value="NN"
                                                       key={4}>Nhóm ngành</Select.Option>
                                        <Select.Option value="N"
                                                       key={4}>Ngành</Select.Option>
                                    </Select>
                                </Space>*/}
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
            title={`Ma trận chuẩn đầu ra chương trình đào tạo: ${trainingItem.vn_name}`}
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
            console.log("aaaaaaaa")
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
            title={`Ma trận học phần chương trình đào tạo: ${trainingItem.vn_name}`}
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

const TrainingProgramItem = ({item, userRole, vnNameSearch}) => {
    const [visibleCourseList, setVisibleCourseList] = useState(false);
    const [visibleLocMatrix, setVisibleLocMatrix] = useState(false);
    const [visibleCourseMatrix, setVisibleCourseMatrix] = useState(false);

    const {coursesMatrixTraining, loadingCoursesMatrix} = useSelector(state => state.trainingPrograms);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getCourseOfMatrixTrainingProgram({id: item.uuid}))
    }, [])

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

    const actionAdmin = !item.lock_edit ?
        [
            <Link to={`/uet/training-programs/updating/${item.uuid}`}>
                <EditOutlined key="edit"/>
            </Link>,

            <BuildOutlined onClick={() => setVisibleLocMatrix(true)}/>,
            <InsertRowBelowOutlined onClick={() => setVisibleCourseMatrix(true)}/>,

            !item.lock_edit ?
                <Popconfirm
                    title="Sau khi khóa sẽ không thể chỉnh sửa?"
                    cancelText="Hủy"
                    okText="Khóa"
                    onConfirm={() => onLock(item.uuid)}
                >
                    <UnlockOutlined/>
                </Popconfirm>
                :
                <Popconfirm
                    title="Mở khóa chương trình đào tạo này?"
                    cancelText="Hủy"
                    okText="Mở khóa"
                    onConfirm={() => onUnLock(item.uuid)}
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
        ] :
        [
            <BuildOutlined onClick={() => setVisibleLocMatrix(true)}/>,
            <InsertRowBelowOutlined onClick={() => setVisibleCourseMatrix(true)}/>,


            /*<Popconfirm
                title="Mở khóa chương trình đào tạo này?"
                cancelText="Hủy"
                okText="Mở khóa"
                onConfirm={() => onUnLock(item.uuid)}
            >
                <LockOutlined/>
            </Popconfirm>,*/

        ]


    const actionStudent = [
        <Icon
            component={() => <i className="fas fa-th-list"/>}
            key="setting"
            onClick={() => {
                setVisibleCourseList(true)
            }}
        />,
    ];

    const actionLecturer = [
        <Icon
            component={() => <i className="fas fa-th-list"/>}
            key="setting"
            onClick={() => {
                setVisibleCourseList(true)
            }}
        />,
    ];


    return (
        <>
            <Card
                extra={
                    <Link to={`/uet/training-programs/${item.uuid}`}>
                        <Button type="primary" shape="circle" icon={<InfoOutlined/>} size="small"/>
                    </Link>
                }
                actions={
                    userRole == 0 ? actionAdmin : (userRole == 3 ? actionStudent : actionLecturer)
                }
                title={item.vn_name}
                hoverable
            >
                <Descriptions column={1} style={{height: '200px'}}>
                    <Descriptions.Item label="Ngành đào tạo">
                        {
                            item.vn_name ? item.vn_name : ''
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại">
                        {
                            item.type ? item.type : ''
                        }
                    </Descriptions.Item>

                    <Descriptions.Item label="Năm">
                        {
                            item.version || ''
                        }
                    </Descriptions.Item>


                    <Descriptions.Item label="Số lớp đang áp dụng">
                        {
                            item.classes ? JSON.parse(item.classes).length : 0
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {
                            item.lock_edit ? "Đã khóa" : "Mở"
                        }
                    </Descriptions.Item>

                </Descriptions>
            </Card>
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
    )
}

export default TrainingProgramItem;