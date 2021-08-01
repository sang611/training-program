import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import * as actions from "../../redux/actions";
import {Modal, Skeleton, Table} from "antd";

const MatrixLearningOutcomesModal = ({trainingItem, visibleLocMatrix, setVisibleLocMatrix}) => {
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

    if(!trainingItem) return <Skeleton />

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

export default MatrixLearningOutcomesModal;