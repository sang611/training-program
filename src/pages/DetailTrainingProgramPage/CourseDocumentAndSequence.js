import Title from "antd/lib/typography/Title";
import {Col, Row, Table} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {generateDataFrame} from "../../utils/frameCourse";
import TextArea from "antd/es/input/TextArea";

const CourseDocumentAndSequence = ({courses, semester}) => {
    let index_course = 1;
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    const columns = [
        {
            title: 'STT',
            render: (_, record) => {
                if(record.uuid) return index_course ++;
            },
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
            width: '30%',
            render: (_, course) => {
                if (course.uuid) {
                    return (
                        <>
                            <div>{course.course_name_vi}</div>
                            <div>
                                <i>{course.course_name_en}</i>
                            </div>
                        </>
                    )
                } else {
                    if(course.h===1)
                        return <b>{course.course_name_vi}</b>
                    else if(course.h===2)
                        return <span style={{fontWeight: 500}}><i>{course.course_name_vi}</i></span>
                }
            }
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            width: 100,
            render: (_, course) => {
                if (course.uuid) return course.credits;
                else return <b>{course.credits}</b>
            }
        },
        {
            title: 'Tài liệu tham khảo',
            dataIndex: ['training_program_course', 'documents'],
            width: '40%',
            render: (_, course) => (
                <TextArea
                    disabled
                    autoSize
                    style={{color: '#000'}}
                    defaultValue={course.training_program_course ? course.training_program_course.documents : ''}
                />
            )
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
                dataSource={generateDataFrame(trainingProgram).map((course) => {
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