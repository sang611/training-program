import {Col, Descriptions, Row, Table} from "antd";
import Title from "antd/lib/typography/Title";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {generateDataFrame} from "../../../utils/frameCourse";

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
            setData(
                generateDataFrame(trainingProgram)
            )
        }

    }, [trainingProgram])


    return (
        <div id="training-course">
            <Title level={4}>
                PHẦN III. NỘI DUNG CHƯƠNG TRÌNH ĐÀO TẠO
            </Title>
            <Title level={4}>
                Tóm tắt yêu cầu chương trình đào tạo
            </Title>
            <Row>
                <Col span={12} offset={1}>
                    {
                        requireSummary ?
                            <Descriptions column={1} labelStyle={{fontWeight: 'bold'}}>
                                <Descriptions.Item label="Tổng số tín chỉ của chương trình đào tạo">
                                    {requireSummary.total} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item label="Khối kiến thức chung">
                                    {requireSummary.common} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item label="Khối kiến thức theo lĩnh vực">
                                    {requireSummary.field} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item label="Khối kiến thức theo khối ngành" span={2}>
                                    {requireSummary.major_unit} tín chỉ
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label="Các học phần bắt buộc"
                                    span={2}
                                    labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                >
                                    {requireSummary.major_unit_B} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Các học phần tự chọn"
                                    span={2}
                                    labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                >
                                    {requireSummary.major_unit_L} tín chỉ
                                </Descriptions.Item>

                                <Descriptions.Item label="Khối kiến thức theo nhóm ngành">
                                    {requireSummary.major_group}
                                </Descriptions.Item>
                                {
                                    !(requireSummary.major_group_B == 0 || requireSummary.major_group_B == "" || !requireSummary.major_group_B) ?
                                        <Descriptions.Item
                                            label="Các học phần bắt buộc"
                                            span={2}
                                            labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                        >
                                            {requireSummary.major_group_B} tín chỉ
                                        </Descriptions.Item>
                                        : ''
                                }

                                {
                                    !(requireSummary.major_group_L == 0 || requireSummary.major_group_L == "" || !requireSummary.major_group_L) ?
                                    <Descriptions.Item
                                        label="Các học phần tự chọn"
                                        span={2}
                                        labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                    >
                                        {requireSummary.major_group_L} tín chỉ
                                    </Descriptions.Item>
                                        : ''
                                }


                                <Descriptions.Item label="Khối kiến thức ngành">
                                    {requireSummary.major}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Các học phần bắt buộc"
                                    span={2}
                                    labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                >
                                    {requireSummary.major_B} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Các học phần tự chọn"
                                    span={2}
                                    labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                >
                                    {requireSummary.major_L} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Các học phần bổ trợ"
                                    span={2}
                                    labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                >
                                    {requireSummary.major_BT} tín chỉ
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Khóa luận tốt nghiệp/Các học phần thay thế"
                                    span={2}
                                    labelStyle={{fontStyle: 'italic', fontWeight: 'normal', marginLeft: '40px'}}
                                >
                                    {requireSummary.major_KLTN} tín chỉ
                                </Descriptions.Item>
                            </Descriptions>
                            : ''
                    }

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
                            course.stt = index_course++;
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
                                if (record.h === 1)
                                    return <b>{record.course_name_vi}</b>
                                else if (record.h === 2)
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
                            if (record.h === 1)
                                return <b>{record.credits}</b>
                            else if (record.h === 2)
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
        </div>
    )
}

export default TrainingCourse;
