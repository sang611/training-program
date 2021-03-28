import {useState, useEffect} from "react";
import Title from "antd/lib/typography/Title";
import {Button, message, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import axios from "axios";
import {Option} from "antd/lib/mentions";
import courses from "../../redux/reducers/courses";


const AddTrainingSequence = ({trainingProgram}) => {
    const [dataSource, setDataSource] = useState([]);
    const [courseSelected, setCourseSelected] = useState([]);
    const [trainingCourses, setTrainingCourse] = useState(trainingProgram.courses);

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(actions.getAllCourse());

        let semesters = [];
        for (let i = 1; i <= trainingProgram.training_duration * 2; ++i) {
            let data = {semester: i, key: i};
            semesters.push(data)
        }
        setDataSource(semesters)
    }, [])

    useEffect(() => {
        setTrainingCourse(
            trainingCourses.filter(course => !courseSelected.includes(course.uuid))
        )
    }, [courseSelected])

    const onUpdatePlan = (trainingProgramUuid, course) => {
        axios.put(`/training-programs/courses/${trainingProgramUuid}/planning`, {...course, trainingProgramUuid})
            .then((res) => {
                message.success("Thành công")
            })
            .catch(() => {
                message.error("Đã có lỗi xảy ra")
            })

    }


    const onDeleteCourseSemester = (courseUuid) => {
        axios.put(`/training-programs/${trainingProgram.uuid}/courses/${courseUuid}`, {semester: null})
            .then((res) => {

            })
            .then(() => {
                const newData = [...dataSource];
                setDataSource(
                    newData.filter((c) => c.uuid !== courseUuid)
                )
            })
            .catch((e) => message.error("Đã có lỗi xảy ra"));
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
                            defaultValue={
                                trainingCourses
                                    .filter(course => course.training_program_course.semester === record.semester)
                                    .map(course => course.uuid)
                            }
                            onChange={(value) => {
                                record.coursesOfSemester = value
                            }}
                            onSelect={(value) => {
                                setCourseSelected([...courseSelected, value])
                            }}
                            onDeselect={(value) => {
                                setCourseSelected(
                                    courseSelected.filter(course => course !== value)
                                )
                                onDeleteCourseSemester(value)
                            }}
                        >
                            {
                                trainingCourses
                                    .map((course, index) => {

                                           return (<Select.Option
                                                value={course.uuid}
                                                key={index}
                                            >
                                                {`${course.course_code} - ${course.course_name_vi}`}
                                            </Select.Option>
                                        )}
                                    )
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
                    onClick={() => onUpdatePlan(trainingProgram.uuid, record)}
                    disabled={record.coursesOfSemester == null}
                >

                    Cập nhật
                </Button>
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