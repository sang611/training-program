import Board from 'react-trello'
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from 'react'
import * as actions from '../../redux/actions'
import {message, Row, Select, Space, Tag} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import Cookies from "universal-cookie/lib";
import Search from "antd/lib/input/Search";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const PrivatePlanningPage = () => {

    const dispatch = useDispatch();
    const [courses, setCourses] = useState([]);
    const {user} = useSelector(state => state.accounts)

    const [availableCourses, setAvailableCourse] = useState([]);
    const [plannedCourses, setPlannedCourse] = useState([]);
    const [completedCourse, setCompletedCourse] = useState([]);
    const [improvedCourse, setImprovedCourse] = useState([]);
    const [repeatedCourse, setRepeatedCourse] = useState([]);

    const [studentCourse, setStudentCourse] = useState([]);

    const [typeSearch, setTypeSearch] = useState("course_name_vi");
    const [plannedValid, setPlannedValid] = useState(false);
    const [numCredits, setNumCredits] = useState(0);
    const [semes, setSemes]=  useState(1);

    const {currentUser, userRole} = useSelector(state => state.auth);
    const semesters = [1,2,3,4,5,6,7,8];



    useEffect(() => {
        dispatch(actions.getAllCourse());
    }, [])

    useEffect(() => {
        if(user)
            setCourses(user.training_program.courses);
            setStudentCourse(user.courses)
        }, [user]
    )


    useEffect(() => {
        if(studentCourse) {
            setCompletedCourse(
                convertCourseToCard(
                    studentCourse.filter((course) => {
                            const {completed, semester} = course.student_course;
                            return (completed == 1 && semester === semes)
                        }
                    )
                )
            )
            setPlannedCourse(
                convertCourseToCard(
                    studentCourse.filter((course) => {
                            const {working, semester} = course.student_course;
                            return (working == 1 && semester == semes)
                        }
                    )
                )
            )
            setImprovedCourse(
                convertCourseToCard(
                    studentCourse.filter((course) => {
                            const {improved, semester} = course.student_course;
                            return (improved == 1 && semester == semes)
                        }
                    )
                )
            )
            setRepeatedCourse(
                convertCourseToCard(
                    studentCourse.filter((course) => {
                            const {repeated, semester} = course.student_course;
                            return (repeated == 1 && semester == semes)
                        }
                    )
                )
            )
        }


    }, [ semes, studentCourse])

    useEffect(() => {
        if(studentCourse) {
            setAvailableCourse(
                convertCourseToCard(
                    courses.filter((course) => {
                            const courseUuid = studentCourse.map(stc => stc.uuid)
                            return !courseUuid.includes(course.uuid)
                        }
                    )
                )
            )
        }


    }, [studentCourse, courses])

    useEffect(() => {
        let totalCreditsPlanned = plannedCourses.reduce((a, b) => a+b.credits, 0)
        if(totalCreditsPlanned <= 30 && totalCreditsPlanned >= 14) {
            setPlannedValid(true)
        } else {

            setPlannedValid(false);
        }
        setNumCredits(totalCreditsPlanned);
    }, [plannedCourses])

    function convertCourseToCard (courses) {
        return courses.map((course) => {
            let cardCourse = {};
            cardCourse.id = course.uuid;
            cardCourse.title = course.course_code;
            cardCourse.description = course.course_name_vi;
            cardCourse.label = course.credits + " tín chỉ";
            cardCourse.credits = course.credits;

            return cardCourse;
        })
    }

    const dataStatusCourse = {
        lanes: [
            {
                id: 'available',
                title: 'Danh sách học phần',
                label: availableCourses.length + " học phần",
                cards: availableCourses,

            },
            {
                id: 'working',
                title: 'Dự định',
                label: plannedCourses.length + " học phần",
                cards: plannedCourses,

            },
            {
                id: 'improved',
                title: 'Học cải thiện',
                label: improvedCourse.length + " học phần",
                cards: improvedCourse,

            },
            {
                id: 'repeated',
                title: 'Học lại',
                label: repeatedCourse.length + " học phần",
                cards: repeatedCourse,

            },
            {
                id: 'completed',
                title: 'Hoàn thành',
                label: completedCourse.length + " học phần",
                cards: completedCourse,

            }
        ]
    }


    const onCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {

        if(fromLaneId !== toLaneId) {

            const data = {};
            data.studentUuid = user.uuid;
            data.courseUuid = cardId;
            data[toLaneId] = 1;

            if (semes) {
                data.semester = semes;
                axios.post('/students/course', data)
                    .then(() => {
                        if (fromLaneId === 'available') {
                            let changeCourse = courses.filter(course => course.uuid == cardId)[0]
                            changeCourse.student_course = {};
                            changeCourse.student_course[toLaneId] = 1;
                            changeCourse.student_course.semester = semes;

                            setStudentCourse([...studentCourse, changeCourse])
                        } else if (toLaneId === 'available') {
                            setStudentCourse(
                                studentCourse.filter((course) => course.uuid !== cardId)
                            )
                        } else {

                            setStudentCourse(
                                studentCourse.map(course => {
                                    if (course.uuid == cardId) {
                                        course.student_course[fromLaneId] = null;
                                        course.student_course[toLaneId] = 1;
                                    }

                                    return course
                                })
                            )

                        }

                    })
                    .catch((e) => {
                        message.error(e.toString());
                    })
            } else {
                message.warn("Vui lòng chọn học kỳ để cập nhật thay đổi")
            }
        }
    }



    const onSearch = (value) => {
        value = value.target.value;
        if(value.trim() != "") {
            setCourses(
                [...user.training_program.courses].filter(course => {
                    return course[typeSearch].toLowerCase().trim()
                        .includes(value.toLowerCase().trim());
                })
            )
        } else {
            setCourses(user.training_program.courses);
        }

    }

    return (
        <>
            <Row justify="space-between" style={{marginBottom: 40}}>
                <Space >
                    <Search
                        placeholder="Tìm kiếm học phần"
                        onChange={onSearch}
                        enterButton
                        style={{ width: 270, }}
                    />
                    <Select
                        style={{ width: 150, }}
                        placeholder="Tìm kiếm theo"
                        defaultValue="course_name_vi"
                        onChange={(value => setTypeSearch(value))}
                    >

                        <Select.Option key="course_name_vi" value="course_name_vi">
                            Tên học phần (vi)
                        </Select.Option>
                        <Select.Option key="course_name_en" value="course_name_en">
                            Tên học phần (en)
                        </Select.Option>
                        <Select.Option key="course_code" value="course_code">
                            Mã học phần
                        </Select.Option>

                    </Select>
                </Space>

                <Select
                    style={{ width: 120 }}
                    placeholder="Chọn kỳ học"
                    onChange={(value => setSemes(value))}
                    defaultValue={1}
                >
                    {
                        semesters.map(semester => {
                            return <Select.Option value={semester} key={semester}>
                                Học kỳ {semester}
                            </Select.Option>
                        })
                    }
                </Select>
            </Row>
            <Row justify="end">
                {
                    plannedValid ?
                        <Tag icon={<CheckCircleOutlined />} color="success">{numCredits} tín chỉ</Tag> :
                        <Tag color="warning" icon={<ExclamationCircleOutlined />}>{numCredits} tín chỉ (Số tín chỉ trong 1 kỳ phải nằm trong khoảng 14-30)</Tag>
                }
            </Row>

            <Board
                data={dataStatusCourse}
                onCardMoveAcrossLanes={onCardMoveAcrossLanes}
                style={{
                    backgroundImage: "url('https://images.wallpaperscraft.com/image/laptop_keyboard_glow_170138_3840x2400.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        </>
    )
}

export default PrivatePlanningPage;
