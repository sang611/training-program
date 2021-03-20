import Board from 'react-trello'
import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from 'react'
import * as actions from '../../redux/actions'
import {message, Select} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import Cookies from "universal-cookie/lib";

const cookies = new Cookies();
const PrivatePlanningPage = () => {

    const dispatch = useDispatch();
    const {courses} = useSelector(state => state.courses)
    const {user} = useSelector(state => state.accounts)
    const [availableCourses, setAvailableCourse] = useState([]);
    const [plannedCourses, setPlannedCourse] = useState([]);
    const [completedCourse, setCompletedCourse] = useState([]);
    const [improvedCourse, setImprovedCourse] = useState([]);
    const [repeatedCourse, setRepeatedCourse] = useState([]);
    const [studentCourse, setStudentCourse] = useState([]);
    const [semes, setSemes]=  useState(null);
    const semesters = [1,2,3,4,5,6,7,8];
    const {uuid, role} = cookies.get("account")

    useEffect(() => {
        dispatch(actions.getAUser({accountUuid: uuid, role: role}))
        dispatch(actions.getAllCourse());
    }, [])

    useEffect(() => {
        if(user)
            setStudentCourse(user.courses)
        }, [user]
    )

    useEffect(() => {
        console.log(studentCourse)
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

    }, [ semes, studentCourse])

    useEffect(() => {
        setAvailableCourse(
            convertCourseToCard(
                courses.filter((course) => {
                        const courseUuid = studentCourse.map(stc => stc.uuid)
                        return !courseUuid.includes(course.uuid)
                    }
                )
            )
        )

    }, [studentCourse])



    function convertCourseToCard (courses) {
        return courses.map((course) => {
            let cardCourse = {};
            cardCourse.id = course.uuid;
            cardCourse.title = course.course_code;
            cardCourse.description = course.course_name_vi;
            cardCourse.label = course.credits + " tín chỉ";
            return cardCourse;
        })
    }

    const dataStatusCourse = {
        lanes: [
            {
                id: 'available',
                title: 'Danh sách học phần',
                label: '2/2',
                cards: availableCourses,

            },
            {
                id: 'working',
                title: 'Dự định',
                label: '2/2',
                cards: plannedCourses,

            },
            {
                id: 'improved',
                title: 'Học cải thiện',
                label: '0/0',
                cards: improvedCourse,

            },
            {
                id: 'repeated',
                title: 'Học lại',
                label: '0/0',
                cards: repeatedCourse,

            },
            {
                id: 'completed',
                title: 'Hoàn thành',
                label: '0/0',
                cards: completedCourse,

            }
        ]
    }


    const onCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {

        const data = {};
        data.studentUuid = user.uuid;
        data.courseUuid = cardId;
        data[toLaneId] = 1;

        if(semes) {
            data.semester = semes;
            axios.post('/students/course', data)
                .then(() => {
                    if(fromLaneId === 'available') {
                        let changeCourse = courses.filter(course => course.uuid == cardId)[0]
                        changeCourse.student_course = {};
                        changeCourse.student_course[toLaneId] = 1;
                        changeCourse.student_course.semester = semes;
                        console.log(changeCourse)
                        setStudentCourse([...studentCourse, changeCourse])
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
    return (
        <>
            <Select
                style={{ width: 120, marginBottom: 40 }}
                placeholder="Chọn kỳ học"
                onChange={(value => setSemes(value))}
            >
                {
                    semesters.map(semester => {
                        return <Select.Option value={semester} key={semester}>
                            {semester}
                        </Select.Option>
                    })
                }
            </Select>
            <Board
                data={dataStatusCourse}
                onCardMoveAcrossLanes={onCardMoveAcrossLanes}
                style={{
                    backgroundImage: "url('https://images.wallpaperscraft.com/image/sea_boat_top_view_128638_1280x720.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        </>
    )
}

export default PrivatePlanningPage;