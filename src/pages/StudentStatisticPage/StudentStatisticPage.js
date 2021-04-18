import {Card, Col, Divider, Row, Select, Space, Spin, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState} from 'react'
import CreditStatistic from "./CreditStatistic";
import CourseTypeByStatusStatistic from "./CourseTypeByStatusStatistic";
import Title from "antd/lib/typography/Title";
import CompletedCreditsStatistic from "./CompletedCreditsStatistic";
import ListCourseStatic from "./ListCourseStatic";
import * as actions from "../../redux/actions";

const StudentStatisticPage = () => {
    const {user} = useSelector(state => state.accounts)
    const {training_program, courses} = user;
    const [semes, setSemes] = useState(0);
    const dispatch = useDispatch();

    const semesters = new Array(user.training_program.training_duration * 2).fill(undefined);

    useEffect(() => {
        dispatch(actions.getAUser({
            accountUuid: user.accountUuid,
        }))
    }, [])

    return !user ? <Spin /> :  (
        <div>
            {

                    training_program.courses.length > 0 || training_program.require_summary ? <>
                        <Row justify="space-between" align="middle">
                            <Space>
                                <Title level={3}>
                                    Thống kê tiến độ học tập
                                </Title>
                                <Select
                                    style={{width: 120}}
                                    placeholder="Chọn kỳ học"
                                    onChange={(value => setSemes(value))}
                                    defaultValue={0}
                                >

                                    <Select.Option value={0} key={0}>
                                        Hiện tại
                                    </Select.Option>
                                    {
                                        semesters.map((_, index) => {
                                            return <Select.Option value={index + 1} key={index + 1}>
                                                Học kỳ {index + 1}
                                            </Select.Option>
                                        })
                                    }
                                </Select>
                            </Space>

                            <Tag color="blue">
                                <Title level={4} style={{margin: 0}}>
                                    {training_program.vn_name}
                                </Title>
                            </Tag>
                        </Row>
                        <Divider/>
                        <Row>

                            <Col sm={{span: 24}} md={{span: 12}} lg={{span: 8}} xl={{span: 8}} xxl={{span: 8}}>
                                <Card title={<Tag color="red"><Title level={4}>Thống kê số tín chỉ theo tiến độ</Title></Tag>}>
                                    <CreditStatistic
                                        courses={courses}
                                        semes={semes}
                                    />
                                </Card>
                            </Col>
                            <Col sm={{span: 24}} md={{span: 12}} lg={{span: 8}} xl={{span: 8}} xxl={{span: 8}}>
                                <Card title={<Tag color="red"><Title level={4}>Thống kê số tín chỉ theo học phần</Title></Tag>}>
                                    <CourseTypeByStatusStatistic
                                        courses={courses}
                                        trainingProgram={training_program}
                                        semes={semes}
                                    />
                                </Card>

                            </Col>
                            <Col sm={{span: 24}} md={{span: 12}} lg={{span: 8}} xl={{span: 8}} xxl={{span: 8}}>
                                <Card title={<Tag color="red"><Title level={4}>Thống kê số tín chỉ còn thiếu</Title></Tag>}>
                                    <CompletedCreditsStatistic
                                        courses={courses}
                                        trainingProgram={training_program}
                                    />
                                </Card>


                            </Col>
                        </Row>

                        <br/>
                        <Divider/>
                        <Row>
                            <Col sm={24} md={{span: 11}}>
                                <Title level={4}>Danh sách học phần dự định </Title>
                                <ListCourseStatic
                                    dataSource={
                                        courses.filter((course) => {
                                            return course.student_course.working && (semes == 0 || course.student_course.semester == semes)
                                        }).map(course => {
                                            course.key = course.uuid;
                                            return course;
                                        })
                                    }
                                />
                            </Col>
                            <Col sm={24} md={{span: 11, offset: 2}}>
                                <Title level={4}>Danh sách học phần học lại</Title>
                                <ListCourseStatic
                                    dataSource={
                                        courses.filter((course) => {
                                            return course.student_course.repeated && (semes == 0 || course.student_course.semester == semes)
                                        }).map(course => {
                                            course.key = course.uuid;
                                            return course;
                                        })
                                    }
                                />
                            </Col>
                        </Row>


                        <Row>
                            <Col sm={24} md={{span: 11}}>
                                <Title level={4}>Danh sách học phần cải thiện</Title>

                                <ListCourseStatic
                                    dataSource={
                                        courses.filter((course) => {
                                            return course.student_course.improved && (semes == 0 || course.student_course.semester == semes)
                                        }).map(course => {
                                            course.key = course.uuid;
                                            return course;
                                        })
                                    }
                                />

                            </Col>
                            <Col sm={24} md={{span: 11, offset: 2}}>
                                <Title level={4}>Danh sách học phần đã hoàn thành</Title>

                                <ListCourseStatic
                                    dataSource={
                                        courses.filter((course) => {
                                            return course.student_course.completed && (semes == 0 || course.student_course.semester == semes)
                                        }).map(course => {
                                            course.key = course.uuid;
                                            return course;
                                        })
                                    }
                                />

                            </Col>
                        </Row>
                    </> : ''

            }

        </div>
    )


        ;
}

export default StudentStatisticPage;
