import {Card, message, Popconfirm, Tag, Timeline} from "antd";
import Title from "antd/lib/typography/Title";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {CopyOutlined} from "@ant-design/icons";
import axios from "axios";
import * as actions from "../../../redux/actions";

const StudentCourseSequenceCard = ({student}) => {
    const {user} = useSelector(state => state.accounts)
    const dispatch = useDispatch();

    function onCopyPlan() {
        let courses = [];
        new Array(student.training_program.training_duration * 2).fill(undefined)
            .forEach((semester, index) => {

                    let studentCourses = student.courses.map((course) => {
                        if (course.student_course.semester === index + 1) {
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
            <Card
                title={

                    <Title level={4} style={{margin: 0}}>
                        {
                            student.accountUuid != user.accountUuid ? student.fullname : "Kế hoạch học tập cá nhân"
                        }
                    </Title>

                }
                actions={student.accountUuid != user.accountUuid ? [
                    <Popconfirm
                        title="Kế hoạch hiện tại sẽ được thay thế bằng kế hoạch này!"
                        onConfirm={onCopyPlan}
                        okText="Copy"
                        cancelText="Hủy"
                    >
                        <CopyOutlined/>
                    </Popconfirm>
                    ,
                ] : []}
                bordered
                hoverable
            >
                <Timeline mode="left">
                    {
                        new Array(student.training_program.training_duration * 2).fill(undefined)
                            .map((semester, index) => {
                                return <Timeline.Item dot={<Tag color="#55acee">{`Kỳ ${index + 1}`}</Tag>}
                                                      color="green">
                                    {
                                        student.courses.filter(course =>
                                            course.student_course.semester === index + 1 && course.student_course.working
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
        </>
    )
}
export default StudentCourseSequenceCard;