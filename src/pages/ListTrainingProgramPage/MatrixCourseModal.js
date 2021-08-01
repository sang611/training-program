import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import * as actions from "../../redux/actions";
import {Modal, Skeleton, Table} from "antd";

const MatrixCourseModal = ({trainingItem, visibleCourseMatrix, setVisibleCourseMatrix}) => {
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
    if(!trainingItem) return <Skeleton />
    return (
        <Modal
            visible={visibleCourseMatrix}
            title={`Danh sách học phần chương trình đào tạo: ${trainingItem.vn_name}`}
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
export default MatrixCourseModal;