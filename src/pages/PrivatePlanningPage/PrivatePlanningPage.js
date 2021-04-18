import Board from 'react-trello'
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from 'react'
import * as actions from '../../redux/actions'
import {Card, Col, Divider, Input, List, message, Popconfirm, Row, Select, Space, Tag, Timeline} from "antd";
import axios from "axios";
import {CheckCircleOutlined, CopyOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import StudentCourseSequenceCard from "./StudentCourseSequenceCard";
import Search from "antd/lib/input/Search";
import StudentStatisticPage from "../StudentStatisticPage";

const PrivatePlanningPage = () => {

    const dispatch = useDispatch();
    const [courses, setCourses] = useState([]);
    const {user} = useSelector(state => state.accounts)
    const {training_program} = user;
    const [availableCourses, setAvailableCourse] = useState([]);
    const [plannedCourses, setPlannedCourse] = useState([]);
    const [completedCourse, setCompletedCourse] = useState([]);
    const [improvedCourse, setImprovedCourse] = useState([]);
    const [repeatedCourse, setRepeatedCourse] = useState([]);

    const [studentCourse, setStudentCourse] = useState([]);

    const [typeSearch, setTypeSearch] = useState("course_name_vi");
    const [typeCourse, setTypeCourse] = useState("ALL");
    const [searchText, setSearchtext] = useState("");
    const [plannedValid, setPlannedValid] = useState(false);
    const [numCredits, setNumCredits] = useState(0);
    const [semes, setSemes] = useState(1);

    const {accounts} = useSelector(state => state.accounts);
    const semesters = new Array(user.training_program.training_duration * 2).fill(undefined);

    const [numMove, setNumMove] = useState(0);


    useEffect(() => {
        dispatch(actions.getAllCourse());
        dispatch(actions.fetchAccounts({typeAccount: 'SV', studentClass: user.class}))
    }, [])

    useEffect(() => {
            if (user)
                setCourses(user.training_program.courses);
            setStudentCourse(user.courses)
        }, [user]
    )


    useEffect(() => {
        if (studentCourse) {
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

    }, [semes, studentCourse])

    useEffect(() => {
        if (studentCourse) {
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
        let totalCreditsPlanned = plannedCourses.reduce((a, b) => a + b.credits, 0)
        if (totalCreditsPlanned <= 30 && totalCreditsPlanned >= 14) {
            setPlannedValid(true)
        } else {

            setPlannedValid(false);
        }
        setNumCredits(totalCreditsPlanned);
    }, [plannedCourses])

    function convertCourseToCard(courses) {
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

        if (fromLaneId !== toLaneId) {

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

                        //if (toLaneId == "working" || fromLaneId == "working")
                           /* dispatch(actions.getAUser({
                                accountUuid: user.accountUuid,
                            }))*/

                    })
                    .catch((e) => {
                        message.error(e.toString());
                    })
            } else {
                message.warn("Vui lòng chọn học kỳ để cập nhật thay đổi")
            }
        }
    }

    useEffect(() => {

        setCourses(
            [...user.training_program.courses]
                .filter(course => {
                    console.log(course.training_program_course.course_type)
                    return typeCourse == "ALL" || course.training_program_course.course_type == typeCourse;
                })
                .filter(course => {
                    let courseTypeSearch = course[typeSearch]
                        .toLowerCase()
                        .trim()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

                    return courseTypeSearch
                        .includes(
                            searchText.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
                })
        )

    }, [typeSearch, typeCourse, searchText])

    const onSearch = (value) => {
        value = value.target.value.trim().toLowerCase();
        setSearchtext(value)
    }

    function onCopyPlan() {
        let courses = [];
        new Array(user.training_program.training_duration * 2).fill(undefined)
            .forEach((semester, index) => {

                    let studentCourses = user.training_program.courses.map((course) => {
                        if (course.training_program_course.semester === index + 1) {
                            return {
                                courseUuid: course.uuid,
                                semester: index + 1
                            }
                        } else return null
                    })
                    courses = courses.concat(
                        studentCourses.filter(course => course)
                    )
                }
            )
        axios.post('/students/course/copy-plan', {
            studentUuid: user.uuid,
            courses: courses
        })
            .then((res) => {
                message.success("Đã copy thành công một kế hoạch học tập")
                dispatch(actions.getAUser({
                    accountUuid: user.accountUuid,
                }))
            })
            .catch((e) => {
                message.error(e.toString());
            })
    }

    return (
        <>
            <Row justify="space-between" style={{marginBottom: 30}}>
                <Col span={15}>
                    <Input.Group compact>
                        <Select
                            style={{width: 100,}}
                            defaultValue="ALL"
                            onChange={(value => setTypeCourse(value))}
                        >
                            <Select.Option key="1" value="ALL">
                                Tất cả
                            </Select.Option>
                            <Select.Option key="2" value="B">
                                Bắt buộc
                            </Select.Option>
                            <Select.Option key="3" value="L">
                                Tự chọn
                            </Select.Option>
                            <Select.Option key="4" value="BT">
                                Bổ trợ
                            </Select.Option>
                        </Select>
                        <Input
                            placeholder="Tìm kiếm học phần"
                            onChange={onSearch}
                            style={{width: 270,}}
                        />
                        <Select
                            style={{width: 150,}}
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
                    </Input.Group>
                </Col>
                <Col>
                    <Select
                        style={{width: 120}}
                        placeholder="Chọn kỳ học"
                        onChange={(value => setSemes(value))}
                        defaultValue={1}
                    >
                        {
                            semesters.map((_, index) => {
                                return <Select.Option value={index + 1} key={index}>
                                    Học kỳ {index + 1}
                                </Select.Option>
                            })
                        }
                    </Select>
                </Col>


            </Row>
            <Row>
                <Col span={20}>

                    {
                        plannedValid ?
                            <Tag icon={<CheckCircleOutlined/>} color="success">{numCredits} tín chỉ</Tag> :
                            <Tag color="warning" icon={<ExclamationCircleOutlined/>}>{numCredits} tín chỉ (Số tín chỉ
                                trong 1 kỳ phải nằm trong khoảng 14-30)</Tag>
                    }

                </Col>
            </Row>
            <Row>
                <Board
                    data={dataStatusCourse}
                    onCardMoveAcrossLanes={onCardMoveAcrossLanes}
                    style={{
                        backgroundImage: "url('https://images.wallpaperscraft.com/image/laptop_keyboard_glow_170138_3840x2400.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </Row>

            <Divider/>

            <Row>
                <Col span={10} offset={1}>
                    <Card title={

                            <Title level={4} style={{margin: 0}}>
                                {`Trình tự đào tạo dự kiến ${training_program.vn_name}`}
                            </Title>

                    }
                          actions={[
                              <Popconfirm
                                  title="Kế hoạch hiện tại sẽ được thay thế bằng kế hoạch này!"
                                  onConfirm={onCopyPlan}
                                  okText="Copy"
                                  cancelText="Hủy"
                              >
                                  <CopyOutlined/>
                              </Popconfirm>
                              ,
                          ]}
                          bordered
                          hoverable
                    >
                        <Timeline mode="left">
                            {
                                new Array(training_program.training_duration * 2).fill(undefined)
                                    .map((semester, index) => {
                                        return <Timeline.Item dot={<Tag color="#55acee">{`Kỳ ${index + 1}`}</Tag>}
                                                              color="green">
                                            {
                                                training_program.courses.filter(course =>
                                                    course.training_program_course.semester === index + 1
                                                )
                                                    .map(course => {
                                                        return <p>{`${course.course_code} - ${course.course_name_vi} (${course.credits} tín chỉ)`}</p>
                                                    })
                                            }
                                        </Timeline.Item>
                                    })
                            }
                        </Timeline>
                    </Card>

                </Col>
                <Col span={10} offset={2}>
                    <StudentCourseSequenceCard student={user}/>
                </Col>
            </Row>

            <Divider/>
            <Row justify="space-between">
                <Col>
                    <Title level={4}>Kế hoạch học tập của các sinh viên khác</Title>
                </Col>
                <Col span={8}>
                    <Search placeholder="Tìm kiếm sinh viên"
                            onSearch={(value) => {
                                dispatch(actions.fetchAccounts({typeAccount: 'SV', studentClass: user.class, fullnameSearch: value}))
                            }}
                            enterButton
                    />
                </Col>
            </Row>

            <br/>

            <List
                grid={{
                    gutter: 20,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                }}
                dataSource={
                    accounts.accounts
                        ? accounts.accounts.filter(acc => acc.uuid != user.uuid)
                        : []
                }

                renderItem={student => (
                    <List.Item>
                        <StudentCourseSequenceCard student={student}/>
                    </List.Item>
                )}
            />


        </>
    )
}

export default PrivatePlanningPage;
