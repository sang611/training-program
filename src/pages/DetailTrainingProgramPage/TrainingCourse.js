import {Col, Descriptions, Row, Table} from "antd";
import Title from "antd/lib/typography/Title";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const TrainingCourse = () => {
    const {Column, ColumnGroup} = Table;
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    let requireSummary = JSON.parse(trainingProgram.require_summary);
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
    let index_course = 1;

    useEffect(() => {
        if (trainingProgram) {
            let requireSummary = {};
            if (trainingProgram.require_summary) {
                requireSummary = JSON.parse(trainingProgram.require_summary)
            }

            let course_c = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'C');
            let course_lv = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'LV');
            let course_kn_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN' && course.training_program_course.course_type === 'B');
            let course_kn_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'KN' && course.training_program_course.course_type === 'L');

            //let course_nn = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN');
            let course_nn_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN' && course.training_program_course.course_type === 'B');
            let course_nn_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'NN' && course.training_program_course.course_type === 'L');

            //let course_n = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N');
            let course_n_B = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'B');
            let course_n_L = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'L');
            let course_n_BT = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'BT');
            let course_n_KLTN = trainingProgram.courses.filter(course => course.training_program_course.knowledge_type === 'N' && course.training_program_course.course_type === 'KLTN');
            setData(
                [{course_name_vi: 'Khối kiến thức chung', credits: requireSummary.common, h: 1}]
                    .concat(course_c)
                    .concat([{
                        course_name_vi: 'Khối kiến thức theo lĩnh vực',
                        credits: requireSummary.field,
                        h: 1
                    }])
                    .concat(course_lv)
                    .concat([{
                        course_name_vi: 'Khối kiến thức theo khối ngành',
                        credits: requireSummary.major_unit,
                        h: 1
                    }])
                    .concat([{course_name_vi: 'Các học phần bắt buộc', credits: requireSummary.major_unit_B, h: 2}])
                    .concat(course_kn_B)
                    .concat([{course_name_vi: 'Các học phần tự chọn', credits: requireSummary.major_unit_L, h: 2}])
                    .concat(course_kn_L)
                    .concat([{
                        course_name_vi: 'Khối kiến thức theo nhóm ngành',
                        credits: requireSummary.major_group,
                        h: 1
                    }])
                    .concat([{course_name_vi: 'Các học phần bắt buộc', credits: requireSummary.major_group_B, h: 2}])
                    .concat(course_nn_B)
                    .concat([{course_name_vi: 'Các học phần tự chọn', credits: requireSummary.major_group_L, h: 2}])
                    .concat(course_nn_L)
                    .concat([{
                        course_name_vi: 'Khối kiến thức ngành',
                        credits: requireSummary.major,
                        h: 1
                    }])
                    .concat([{course_name_vi: 'Các học phần bắt buộc', credits: requireSummary.major_B, h: 2}])
                    .concat(course_n_B)
                    .concat([{course_name_vi: 'Các học phần tự chọn', credits: requireSummary.major_L, h: 2}])
                    .concat(course_n_L)
                    .concat([{course_name_vi: 'Các học phần bổ trợ', credits: requireSummary.major_BT, h: 2}])
                    .concat(course_n_BT)
                    .concat([{course_name_vi: 'KLTN/Các học phần thay thế', credits: requireSummary.major_KLTN, h: 2}])
                    .concat(course_n_KLTN)
            )
        }

    }, [trainingProgram])


    return (
        <>
            <Title level={4}>
                PHẦN III. NỘI DUNG CHƯƠNG TRÌNH ĐÀO TẠO
            </Title>
            <Title level={4}>
                Tóm tắt yêu cầu chương trình đào tạo
            </Title>
            <Row>
                <Col span={12} offset={1}>
                    <Descriptions column={1} labelStyle={{fontWeight: 'bold'}}>
                        <Descriptions.Item label="Tổng số tín chỉ của chương trình đào tạo">
                            {requireSummary ? requireSummary.total : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức chung">
                            {requireSummary ? requireSummary.common : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức theo lĩnh vực">
                            {requireSummary ? requireSummary.field : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức theo khối ngành" span={2}>
                            {requireSummary ? requireSummary.major_unit : '?'} tín chỉ
                        </Descriptions.Item>

                        <Descriptions.Item
                            label="Các học phần bắt buộc"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_unit_B : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Các học phần tự chọn"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_unit_L : '?'} tín chỉ
                        </Descriptions.Item>

                        <Descriptions.Item label="Khối kiến thức theo nhóm ngành">
                            {requireSummary ? requireSummary.major_group : ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Các học phần bắt buộc"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_group_B : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Các học phần tự chọn"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_group_L : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item label="Khối kiến thức ngành">
                            {requireSummary ? requireSummary.major : ''}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Các học phần bắt buộc"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_B : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Các học phần tự chọn"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_L : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Các học phần bổ trợ"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_BT : '?'} tín chỉ
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Khóa luận tốt nghiệp/Các học phần thay thế"
                            span={2}
                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                        >
                            {requireSummary ? requireSummary.major_KLTN : '?'} tín chỉ
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <br/>
            <Title level={4}>
                Khung chương trình đào tạo
            </Title>
            <Table
                dataSource={
                    data.map((course, index) => {
                        course.key = course.uuid;
                        if (course.uuid) {
                            course.stt = index_course ++;
                        }
                        return course
                    })
                }
               bordered
               pagination={false}
            >
                <Column title="STT" dataIndex="stt" key="stt"/>
                <Column title="Mã học phần" dataIndex="course_code" key="course_code"/>
                <Column
                    title="Học phần"
                    key="course_name"
                    render={
                        (_, record) => {
                            if (record.uuid) {
                                return (
                                    <>
                                        <div>{record.course_name_vi}</div>
                                        <div>
                                            <i>{record.course_name_en}</i>
                                        </div>
                                    </>
                                )
                            } else {
                                if(record.h===1)
                                    return <b>{record.course_name_vi}</b>
                                else if(record.h===2)
                                    return <span style={{fontWeight: 500}}><i>{record.course_name_vi}</i></span>
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
                        } else {
                            if(record.h===1)
                                return <b>{record.credits}</b>
                            else if(record.h===2)
                                return <span style={{fontWeight: 500}}><i>{record.credits}</i></span>
                        }
                    }}
                />
                <ColumnGroup title="Số giờ tín chỉ">
                    <Column title="Lý thuyết" dataIndex={['training_program_course', 'theory_time']} key="theory_time"/>
                    <Column title="Bài tập" dataIndex={['training_program_course', 'exercise_time']}
                            key="exercise_time"/>
                    <Column title="Thực hành" dataIndex={['training_program_course', 'practice_time']}
                            key="practice_time"/>
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
