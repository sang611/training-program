import {Col, Descriptions, Row, Table} from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import {useSelector} from "react-redux";

const TrainingCourse = () => {
    const {Column, ColumnGroup} = Table;
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    let data = trainingProgram.courses.map((course, index) => {
        return {
            key: course.uuid,
            stt: index + 1,
            course_code: course.course_code,
            course_name_vi: course.course_name_vi,
            course_name_en: course.course_name_en,
            credits: course.credits,
            required_course: course.required_course,
            theory_time: course.training_program_course.theory_time,
            exercise_time: course.training_program_course.exercise_time,
            practice_time: course.training_program_course.practice_time,
        }
    })
    let requireSummary = JSON.parse(trainingProgram.require_summary);
    return (
        <>
            <Title level={3}>
                III. Nội dung chương trình đào tạo
            </Title>
            <Title level={4}>
                Tóm tắt yêu cầu chương trình đào tạo
            </Title>
            <Row>
                <Col span={12}>
                    <Descriptions column={1} contentStyle={{fontWeight: 'bold', fontSize: '18px'}} bordered>
                        <Descriptions.Item label="Tổng số tín chỉ của chương trình đào tạo"
                                           labelStyle={{fontWeight: 'bold'}}>
                            {requireSummary ? requireSummary.total : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức chung">
                            {requireSummary ? requireSummary.common : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức theo lĩnh vực">
                            {requireSummary ? requireSummary.field : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức theo khối ngành" span={2}>
                            {requireSummary ? requireSummary.major_unit : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức theo nhóm ngành">
                            {requireSummary ? requireSummary.major_group : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức ngành">
                            {requireSummary ? requireSummary.major : ''}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <br/>
            <Title level={4}>
                Khung chương trình đào tạo
            </Title>
            <Table dataSource={data} bordered pagination={false}>
                <Column title="STT" dataIndex="stt" key="stt"/>
                <Column title="Mã học phần" dataIndex="course_code" key="course_code"/>
                <Column
                    title="Học phần"
                    key="course_name"
                    render={
                        (_, record) => {
                            return (
                                <>
                                    <div>{record.course_name_vi}</div>
                                    <div>
                                        <i>{record.course_name_en}</i>
                                    </div>
                                </>
                            )
                        }
                    }
                />
                <Column title="Số tín chỉ" dataIndex="credits" key="credits"/>
                <ColumnGroup title="Số giờ tín chỉ">
                    <Column title="Lý thuyết" dataIndex="theory_time" key="theory_time"/>
                    <Column title="Bài tập" dataIndex="exercise_time" key="exercise_time"/>
                    <Column title="Thực hành" dataIndex="practice_time" key="practice_time"/>
                </ColumnGroup>
                <Column
                    title="Học phần tiên quyết"
                    key="credits"
                    render={(_, record) => {
                        const requiredCourse = JSON.parse(record.required_course);
                        return requiredCourse ? requiredCourse.map((course, index) => {
                            return <div>{course.course_code}</div>
                        }) : ''
                    }}
                />
            </Table>
        </>
    )
}

export default TrainingCourse;