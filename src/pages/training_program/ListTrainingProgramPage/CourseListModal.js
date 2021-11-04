import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {generateDataFrame} from "../../../utils/frameCourse";
import * as actions from "../../../redux/actions";
import {Col, Collapse, Modal, Row, Skeleton, Table} from "antd";
import SearchCourseFrameComponent from "../UpdateTrainingProgramPage/SearchCourseFrameComponent";

const CourseListModal = ({visibleCourseList, setVisibleCourseList, trainingItem}) => {
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

export default CourseListModal;