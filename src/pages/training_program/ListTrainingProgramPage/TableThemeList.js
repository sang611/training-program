import {message, Popconfirm, Space, Table, Tooltip} from "antd";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions";
import axios from "axios";
import {Link} from "react-router-dom";
import {
    BuildOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    InsertRowBelowOutlined,
    UnlockOutlined
} from "@ant-design/icons";
import React, {useState} from "react";
import MatrixLearningOutcomesModal from "./MatrixLearningOutcomesModal";
import CourseListModal from "./CourseListModal";

const TableThemeList = (vnNameSearch) => {
    const {trainingPrograms, loadingAllTrainings, errors} = useSelector(state => state.trainingPrograms)
    const [item, setItem] = useState();
    const {userRole} = useSelector(state => state.auth)

    const EditIcon = (record) => (
        <Link to={`/uet/training-programs/updating/${record.uuid}`}>
            <Tooltip title="Chỉnh sửa" color="#108ee9">
                <EditOutlined key="edit"/>
            </Tooltip>
        </Link>
    )
    const CloneIcon = (record) => (
        <Link to={`/uet/training-programs/clone/${record.uuid}`}>
            <Tooltip title="Sao chép" color="#108ee9">
                <CopyOutlined />
            </Tooltip>
        </Link>
    )
    const LocMatrixIcon = (record) => (
        <Tooltip title="Ma trận CĐR" color="#108ee9">
            <BuildOutlined onClick={() => {
                setItem(record)
                setVisibleLocMatrix(true)
            }}
                           style={{color: "#1890FF"}}
            />
        </Tooltip>
    )
    const CourseListIcon = (record) => (
        <Tooltip title="Danh sách HP" color="#108ee9">
            <InsertRowBelowOutlined onClick={() => {
                setItem(record)
                setVisibleCourseList(true)
            }}
                                    style={{color: "#1890FF"}}
            />
        </Tooltip>
    )
    const LockIcon = (record) => (
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
    )
    const DeleteIcon = (record) => (
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
    )

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
            title: "Danh sách lớp áp dụng",
            render: (_, item) => {
                return item.classes ? JSON.parse(item.classes).reduce((cl1, cl2) => cl1 + ", " + cl2) : 0
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
                if (userRole < 2) {
                    if (!record.lock_edit) {
                        return (
                            <Space size="middle">
                                {EditIcon(record)}
                                {CloneIcon(record)}
                                {LocMatrixIcon(record)}
                                {CourseListIcon(record)}
                                {LockIcon(record)}
                                {DeleteIcon(record)}
                            </Space>

                        )
                    } else {
                        return (
                            <Space size="middle">
                                {LocMatrixIcon(record)}
                                {CourseListIcon(record)}
                            </Space>
                        )
                    }
                } else if (userRole === 3) {
                    return (
                        <>
                            {CourseListIcon(record)}
                        </>
                    )
                } else {
                    return (
                        <>
                            {CourseListIcon(record)}
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

export default TableThemeList;