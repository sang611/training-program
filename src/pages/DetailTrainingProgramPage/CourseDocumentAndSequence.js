import Title from "antd/lib/typography/Title";
import {Col, Row, Table} from "antd";
import React from "react";
import {useSelector} from "react-redux";

const CourseDocumentAndSequence = ({courses, semester}) => {
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    const columns = [
        {
            title: 'STT',
            render: (value, row, index) => index + 1,
            width: 80
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
            width: '10%'
        },
        {
            title: 'Tên học phần (vi)',
            dataIndex: 'course_name_vi',
            width: '30%'
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            width: 100
        },
        {
            title: 'Tài liệu tham khảo',
            dataIndex: ['training_program_course', 'documents'],
            width: '40%'
        },

    ]

    if (semester) {
        columns.pop();
    }

    return !semester ? (
        <>
            <Title level={4}>
                {"Danh mục tài liệu tham khảo"}
            </Title>
            <Table
                columns={columns}
                dataSource={courses.map((course) => {
                    course.key = course.uuid
                    return course;
                })}
                bordered
                pagination={false}
            />
        </>
    ) : (
        <>
            <Title level={4}>
                {"Trình tự đào tạo dự kiến"}
            </Title>

            {
                new Array(trainingProgram.training_duration * 2).fill(undefined).map((_, index) => {
                    return (
                        <>
                            <Title level={5}>{`Kỳ ${index + 1}`}</Title>
                            <Row>
                                <Col span={15} offset={2}>
                                    <Table
                                        columns={columns}
                                        dataSource={
                                            courses
                                                .filter((course) => course.training_program_course.semester === index + 1)
                                                .map((course) => {
                                                    course.key = course.uuid
                                                    return course;
                                                })}
                                        bordered
                                        pagination={false}
                                        footer={() => {
                                            return <Row align="end">
                                                Tổng số tín chỉ: &nbsp;
                                                <b>
                                                    {
                                                        courses
                                                            .filter((course) => course.training_program_course.semester === index + 1)
                                                            .map(course => course.credits)
                                                            .reduce((c1, c2) => (c1 + c2), 0)
                                                    }
                                                </b>
                                            </Row>

                                        }}
                                    />
                                </Col>
                            </Row>
                            <br/>
                        </>
                    )
                })
            }
        </>
    )
}

export default CourseDocumentAndSequence;