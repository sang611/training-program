import {Col, Descriptions, Row, Table} from "antd";
import Title from "antd/lib/typography/Title";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const TrainingCourse = () => {
    const {Column, ColumnGroup} = Table;
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    /*let data = trainingProgram.courses.map((course, index) => {
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
            self_time: course.training_program_course.self_time,
        }
    })*/

    const [data, setData] = useState([]);

    useEffect(() => {
        if (trainingProgram) {
            let requireSummary = {};
            if(trainingProgram.require_summary) {
                requireSummary = JSON.parse(trainingProgram.require_summary)
            }

            let course_c = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'C');
            let course_lv = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'LV');
            let course_kn = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN');
            let course_nn = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN');
            let course_n = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N');
            setData(
                [{course_name_vi: 'Khối kiến thức chung', credits: requireSummary.common}]
                    .concat(course_c).concat([{course_name_vi: 'Khối kiến thức theo lĩnh vực', credits: requireSummary.field}])
                    .concat(course_lv).concat([{course_name_vi: 'Khối kiến thức theo khối ngành', credits: requireSummary.major_unit}])
                    .concat(course_kn).concat([{course_name_vi: 'Khối kiến thức theo nhóm ngành', credits: requireSummary.major_group}])
                    .concat(course_nn).concat([{course_name_vi: 'Khối kiến thức ngành', credits: requireSummary.major}])
                    .concat(course_n)
            )
        }

    }, [trainingProgram])

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
                <Col span={12} offset={1}>
                    <Descriptions column={1} labelStyle={{fontWeight: 'bold'}}>
                        <Descriptions.Item label="Tổng số tín chỉ của chương trình đào tạo">
                            {requireSummary ? requireSummary.total : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức chung" style={{textAlign: 'start !important'}}>
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
            <Table dataSource={
                data.map((course, index) => {
                    course.key = course.uuid;
                    if (course.uuid) {

                        if (course.training_program_course.knowledge_type === 'C') {
                            course.stt = index
                        }
                        if (course.training_program_course.knowledge_type === 'LV') {
                            course.stt = index - 1
                        }
                        if (course.training_program_course.knowledge_type === 'KN') {
                            course.stt = index - 2
                        }
                        if (course.training_program_course.knowledge_type === 'NN') {
                            course.stt = index - 3
                        }
                        if (course.training_program_course.knowledge_type === 'N') {
                            course.stt = index - 4
                        }
                    }
                    return course
                })
            } bordered pagination={false}>
                <Column title="STT" dataIndex="stt" key="stt"/>
                <Column title="Mã học phần" dataIndex="course_code" key="course_code"/>
                <Column
                    title="Học phần"
                    key="course_name"
                    render={
                        (_, record) => {
                            if(record.uuid) {
                                return (
                                    <>
                                        <div>{record.course_name_vi}</div>
                                        <div>
                                            <i>{record.course_name_en}</i>
                                        </div>
                                    </>
                                )
                            }
                            else {
                                return <b>{record.course_name_vi}</b>
                            }
                        }
                    }
                />
                <Column
                    title="Số tín chỉ"
                    dataIndex="credits"
                    key="credits"
                    render={(_, record) => {
                        if (record.uuid) {
                            return record.credits
                        }
                        else return <b>{record.credits}</b>
                    }}
                />
                <ColumnGroup title="Số giờ tín chỉ">
                    <Column title="Lý thuyết" dataIndex={['training_program_course', 'theory_time']} key="theory_time"/>
                    <Column title="Bài tập" dataIndex={['training_program_course', 'exercise_time']} key="exercise_time"/>
                    <Column title="Thực hành" dataIndex={['training_program_course', 'practice_time']} key="practice_time"/>
                    <Column title="Tự học" dataIndex={['training_program_course', 'self_time']} key="self_time"/>
                </ColumnGroup>
                <Column
                    title="Học phần tiên quyết"
                    key="credits"
                    render={(_, record) => {
                        if (record.required_course) {
                            const requiredCourse = JSON.parse(record.required_course);
                            return requiredCourse ? requiredCourse.map((course, index) => {
                                return <div>{course.course_code}</div>
                            }) : ''
                        }
                    }}
                />
            </Table>
        </>
    )
}

export default TrainingCourse;
