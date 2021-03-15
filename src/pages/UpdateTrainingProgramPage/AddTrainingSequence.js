import {useState, useEffect} from "react";
import Title from "antd/lib/typography/Title";
import {Button, message, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import axios from "axios";


const AddTrainingSequence = ({trainingProgram}) => {
    const [dataSource, setDataSource] = useState([]);
    const dispatch = useDispatch();
    const courseState = useSelector(state => state.courses)

    useEffect(() => {

        dispatch(actions.getAllCourse());

        let semesters = [];
        for (let i = 1; i <= trainingProgram.duration * 2; ++i) {
            let data = {semester: i, key: i};
            semesters.push(data)
        }
        setDataSource(semesters)
    }, [])

    const onUpdatePlan = (trainingProgramUuid, course) => {
        axios.put(`/training-programs/courses/${trainingProgramUuid}/${course.uuid}/planning`, {...course, trainingProgramUuid})
            .then((res) => {
                message.success("Thành công")
            })
            .catch(() => {
                message.error("Đã có lỗi xảy ra")
            })

    }

    const columns = [
        {
            title: 'Kỳ',
            dataIndex: 'semester',
            width: 100
        },
        {
            title: 'Học phần',
            render: (_, record) => {
                return (
                    <>
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            style={{width: '100%'}}
                            placeholder="Chọn học phần cho kỳ"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={(value) => record.coursesOfSemester = value}
                        >
                            {
                                courseState.loading === false ?  courseState.response.data.courses.map((ins, index) =>
                                    <Select.Option
                                        value={ins.uuid}
                                        key={index}
                                    >
                                        {`${ins.course_code} - ${ins.course_name_vi}`}
                                    </Select.Option>
                                ) : []
                            }
                        </Select>
                    </>
                )
            }
        },
        {
            title: '',
            render: (_, record) => {
                return <Button
                    onClick={() => onUpdatePlan(trainingProgram.uuid, record)} >Cập nhật</Button>
            },
            width: 100
        },
    ]

    return (
        <>
            <Title level={4}>
                Trình tự đào tạo dự kiến
            </Title>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
            />
        </>
    )
}

export default AddTrainingSequence;