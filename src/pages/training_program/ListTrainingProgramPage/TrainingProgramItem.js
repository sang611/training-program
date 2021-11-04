import {Link} from "react-router-dom";
import {Button, Card, Descriptions, message, Popconfirm, Tooltip} from "antd";
import {
    BuildOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoOutlined,
    InsertRowBelowOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import axios from "axios";
import * as actions from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import MatrixLearningOutcomesModal from "./MatrixLearningOutcomesModal";
import CourseListModal from "./CourseListModal";

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
            // if(course.outline_snapshots) course.outlines = course.outline_snapshots;
            if(course.outlines.length > 0) {
                course_outlines.push({
                    courseUuid: course.uuid,
                    outlineUuid: course.outlines[0] ? course.outlines[0].uuid : ""
                })
            }
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

    const EditIcon = (
        <Link to={`/uet/training-programs/updating/${item.uuid}`}>
            <Tooltip title="Chỉnh sửa" color="#108ee9">
                <EditOutlined key="edit"/>
            </Tooltip>
        </Link>
    )
    const CloneIcon = (
        <Link to={`/uet/training-programs/clone/${item.uuid}`}>
            <Tooltip title="Sao chép" color="#108ee9">
                <CopyOutlined/>
            </Tooltip>
        </Link>
    )
    const LocMatrixIcon = (
        <Tooltip title="Ma trận CĐR" color="#108ee9">
            <BuildOutlined onClick={() => setVisibleLocMatrix(true)}/>
        </Tooltip>
    )
    const CourseListIcon = (
        <Tooltip title="Danh sách HP" color="#108ee9">
            <InsertRowBelowOutlined onClick={() => setVisibleCourseList(true)}/>
        </Tooltip>
    )
    const LockIcon = (
        <Popconfirm
            title="Sau khi khóa sẽ không thể chỉnh sửa?"
            cancelText="Hủy"
            okText="Khóa"
            onConfirm={() => onLock(item.uuid)}
        >
            <Tooltip title="Khóa" color="#108ee9">
                <UnlockOutlined/>
            </Tooltip>
        </Popconfirm>
    )
    const DeleteIcon = (
        <Popconfirm
            title="Xóa CTĐT?"
            cancelText="Hủy"
            okText="Xóa"
            onConfirm={() => onDeleteTrainingProgram(item.uuid)}
        >
            <Tooltip title="Xóa" color="#108ee9">
                <DeleteOutlined/>
            </Tooltip>
        </Popconfirm>
    )


    const actionAdmin = !item.lock_edit ?
        [
            EditIcon,
            CloneIcon,
            LocMatrixIcon,
            CourseListIcon,
            LockIcon,
            DeleteIcon
        ] :
        [
            CloneIcon,
            LocMatrixIcon,
            CourseListIcon,
        ]


    const actionStudent = [
        CourseListIcon
    ];

    const actionLecturer = [
        CourseListIcon
    ];

    return (
        <>
            <Card
                extra={
                    <Link to={`/uet/training-programs/${item.uuid}`}>
                        <Tooltip title="Chi tiết" color="#108ee9">
                            <Button type="primary" shape="circle" icon={<InfoOutlined/>} size="small"/>
                        </Tooltip>

                    </Link>
                }
                actions={userRole < 2 ? actionAdmin : (userRole === 3 ? actionStudent : actionLecturer)}
                title={item.vn_name}
                hoverable
            >
                <Descriptions column={1} style={{height: '200px'}}>
                    <Descriptions.Item label="Ngành đào tạo">
                        {
                            item.vn_name ? item.vn_name : ''
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Hệ">
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
                            item.lock_edit ? "Đã ban hành" : "Chưa ban hành"
                        }
                    </Descriptions.Item>

                </Descriptions>
            </Card>

            <>
                <MatrixLearningOutcomesModal
                    trainingItem={item}
                    visibleLocMatrix={visibleLocMatrix}
                    setVisibleLocMatrix={setVisibleLocMatrix}
                />

                <CourseListModal
                    trainingItem={item}
                    visibleCourseList={visibleCourseList}
                    setVisibleCourseList={setVisibleCourseList}
                />
            </>
        </>
    )
}

export default TrainingProgramItem;
