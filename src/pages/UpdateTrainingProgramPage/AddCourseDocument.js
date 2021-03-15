import Title from "antd/lib/typography/Title";
import TextArea from "antd/lib/input/TextArea";
import {Button, message, Select, Table} from "antd";
import axios from "axios";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import {Option} from "antd/lib/mentions";
import {CheckCircleOutlined, CheckOutlined} from "@ant-design/icons";

const AddCourseDocument = ({trainingProgram, type}) => {

    const dispatch = useDispatch();
    const state = useSelector((state) => state.accounts);

    const onUpdateDocument = (trainingProgramUuid, course) => {
        axios.put(`/training-programs/courses/${trainingProgramUuid}/${course.uuid}`, course)
            .then((res) => {
                message.success("Thành công")
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
                            record.documents = e.target.value
                        }}
                    />) : (
                    <Select
                        mode="multiple"
                        allowClear
                        style={{width: '300px'}}
                        placeholder="Chọn cán bộ"
                        defaultValue={JSON.parse(record.training_program_course.lecturers).map(lec => lec.uuid) }
                        onChange={value => {
                            record.lecturers = JSON.stringify(
                                value.map((val) => {
                                    let lecturer = state.accounts.accounts.find((acc) => acc.uuid === val)

                                    return lecturer;
                                })
                            )
                        }}
                    >
                        {
                            state.accounts.accounts ?
                                state.accounts.accounts.map((employee, index) => {
                                    return (
                                        <Select.Option value={employee.uuid} label={employee.fullname} key={index}>
                                            <div className="demo-option-label-item">
                                                {`${employee.fullname} (${employee.vnu_mail})`}
                                            </div>
                                        </Select.Option>

                                    )

                                }) : []
                        }
                    </Select>
                )
            }
        },
        {
            title: '',
            render: (_, record) => {
                return <Button
                    onClick={() => onUpdateDocument(trainingProgram.uuid, record)} >Cập nhật</Button>
            }
        },

    ]

    return (
        <>
            <Title level={4}>
                {type === "doc" ? "Danh mục tài liệu tham khảo" : "Đội ngũ cán bộ giảng dạy"}
            </Title>
            <Table
                columns={columns}
                dataSource={trainingProgram.courses}
                bordered
                pagination={false}
            />
        </>
    )
}

export default AddCourseDocument;