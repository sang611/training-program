import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import {Button, message, Select, Table} from "antd";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import {generateDataFrame} from "../../utils/frameCourse";

const AddCourseDocument = ({trainingProgram, type}) => {

    const dispatch = useDispatch();
    const {accounts} = useSelector(state => state.accounts);


    const [editing, setEditing] = useState([]);

    const onUpdateDocument = (trainingProgramUuid, course) => {
        let apiUrl = `/training-programs/${trainingProgramUuid}/courses/${course.courseUuid}/documents`

        axios.put(apiUrl, course)
            .then((res) => {
                message.success("Cập nhật thành công")
            })
            .catch(() => {
                message.error("Đã có lỗi xảy ra")
            })
    }

    const onAddLecturer = (trainingProgramUuid, course, lecturer) => {
        let apiUrl = `/training-programs/${trainingProgramUuid}/courses/${course.courseUuid}/lecturers/adding`;
        axios.put(apiUrl, lecturer)
            .then((res) => {
            })
            .catch(() => {
                message.error("Đã có lỗi xảy ra")
            })
    }

    const onRemoveLecturer = (trainingProgramUuid, course, lecturer) => {
        let apiUrl = `/training-programs/${trainingProgramUuid}/courses/${course.courseUuid}/lecturers/removing`;
        axios.put(apiUrl, lecturer)
            .then((res) => {
            })
            .catch(() => {
                message.error("Đã có lỗi xảy ra")
            })
    }

    useEffect(() => {
        if (type === "lec") {
            dispatch(actions.fetchAccounts({typeAccount: "GV", fullnameSearch: ""}))
        }
    }, [])

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
        },
        {
            title: 'Tên học phần (vi)',
            dataIndex: 'course_name_vi',
            editable: true,
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
                    if(course.h===1)
                        return <b>{course.course_name_vi}</b>
                    else if(course.h===2)
                        return <span style={{fontWeight: 500}}><i>{course.course_name_vi}</i></span>
                }
            }
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            render: (_, course) => {
                if (course.uuid) return course.credits;
                else return <b>{course.credits}</b>
            }
        },
        {
            title: type === "doc" ? 'Tài liệu tham khảo' : 'Cán bộ giảng dạy',
            render: (_, record) => {
                return record.uuid ? type === "doc" ? (
                    <TextArea
                        cols={45}
                        rows={6}
                        autoSize
                        defaultValue={record.training_program_course.documents}
                        onChange={(e) => {
                            setEditing([...editing, record.uuid]);
                            record.training_program_course.documents = e.target.value
                        }}
                    />
                ) : (
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '300px'}}
                        placeholder="Chọn cán bộ"
                        defaultValue={
                            record.training_program_course.lecturers ?
                                JSON.parse(record.training_program_course.lecturers).map(lec => lec.uuid) : []
                        }
                        onSelect={(value) => {
                            let lecturer = accounts.find((acc) => acc.uuid === value)
                            onAddLecturer(trainingProgram.uuid, record.training_program_course, {lecturer});
                        }

                        }
                        onDeselect={(value => {
                            let lecturer = accounts.find((acc) => acc.uuid === value)
                            onRemoveLecturer(trainingProgram.uuid, record.training_program_course, {lecturer});
                        })}
                    >
                        {

                                accounts.map((employee, index) => {
                                    return (
                                        <Select.Option
                                            value={employee.uuid}
                                            label={employee.fullname}
                                            key={index}
                                        >
                                            <div className="demo-option-label-item">
                                                {`${employee.fullname} (${employee.vnu_mail})`}
                                            </div>
                                        </Select.Option>

                                    )

                                })
                        }
                    </Select>
                ) : ''
            }
        },
        {
            title: '',
            render: (_, record) => {
                return record.uuid ? <Button
                    onClick={() => {
                        onUpdateDocument(trainingProgram.uuid, record.training_program_course);
                        setEditing(editing.filter(red => red !== record.uuid))
                    }}
                    disabled={!editing.includes(record.uuid)}
                >
                    Cập nhật
                </Button> : ''
            }
        },
    ]
    let index_course = 1;
    if (type === "lec") columns.pop()

    return (
        <>
            <Title level={4}>
                {type === "doc" ? "Danh mục tài liệu tham khảo" : "Đội ngũ cán bộ giảng dạy"}
            </Title>
            <Table
                columns={columns}
                dataSource={generateDataFrame(trainingProgram).map(
                    (course, index) => {
                        course.key = course.uuid;
                        if (course.uuid) {
                            course.stt = index_course ++;
                        }
                        return course
                    }
                )}
                bordered
                pagination={false}
            />
        </>
    )
}

export default AddCourseDocument;
