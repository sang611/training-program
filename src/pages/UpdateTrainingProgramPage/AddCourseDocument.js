import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import {Button, message, Select, Table} from "antd";
import axios from "axios";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import {Option} from "antd/lib/mentions";
import {CheckCircleOutlined, CheckOutlined} from "@ant-design/icons";
import {course} from "../../constants/Items";

const AddCourseDocument = ({trainingProgram, type}) => {

    const dispatch = useDispatch();
    const {accounts} = useSelector((state) => state.accounts);

    const [editing, setEditing] = useState([]);

    useEffect(() => {
        console.log("doc render")
    }, [trainingProgram])

    const onUpdateDocument = (trainingProgramUuid, course) => {
        let apiUrl = `/training-programs/${trainingProgramUuid}/courses/${course.courseUuid}/documents`

        axios.put(apiUrl, course)
            .then((res) => {
                message.success("Thành công")
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
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
        },
        {
            title: type === "doc" ? 'Tài liệu tham khảo' : 'Cán bộ giảng dạy',
            render: (_, record) => {
                return type === "doc" ? (
                    <TextArea
                        cols={40}
                        rows={5}
                        defaultValue={record.training_program_course.documents}
                        onChange={(e) => {
                            setEditing([...editing, record.uuid]);
                            record.training_program_course.documents = e.target.value
                        }}
                    />) : (
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '300px'}}
                        placeholder="Chọn cán bộ"
                        defaultValue={
                            record.training_program_course.lecturers ?
                                JSON.parse(record.training_program_course.lecturers).map(lec => lec.uuid) : []
                        }
                        /*onChange={value => {
                            setEditing([...editing, record.uuid]);
                            record.training_program_course.lecturers = JSON.stringify(
                                value.map((val) => {
                                    let lecturer = state.accounts.accounts.find((acc) => acc.uuid === val)
                                    return lecturer;
                                })
                            )
                        }}*/
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
                                        <Select.Option value={employee.uuid} label={employee.fullname} key={index}>
                                            <div className="demo-option-label-item">
                                                {`${employee.fullname} (${employee.vnu_mail})`}
                                            </div>
                                        </Select.Option>

                                    )

                                })
                        }
                    </Select>
                )
            }
        },
        {
            title: '',
            render: (_, record) => {
                return <Button
                    onClick={() => onUpdateDocument(trainingProgram.uuid, record.training_program_course)}
                    disabled={!editing.includes(record.uuid)}
                >
                    Cập nhật
                </Button>
            }
        },
    ]

    if (type == "lec") columns.pop()

    return (
        <>
            <Title level={4}>
                {type === "doc" ? "Danh mục tài liệu tham khảo" : "Đội ngũ cán bộ giảng dạy"}
            </Title>
            <Table
                columns={columns}
                dataSource={trainingProgram.courses.map(
                    (course, index) => {
                        course.key = course.uuid;
                        course.stt = index + 1;
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
