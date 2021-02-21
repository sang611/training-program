import {useState, useEffect} from 'react'
import axios from "axios";
import {useParams} from "react-router";
import {Col, Row, Space, Table, Tag} from "antd";
import Title from "antd/lib/typography/Title";
import Parser from 'html-react-parser';

const DetailTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    const [trainingProgram, setTrainingProgram] = useState(null)
    useEffect(() => {
        axios.get(`/training-programs/${uuid}`)
            .then((res) => {
                console.log(res.data)
                setTrainingProgram(res.data.trainingProgram)
            })
            .catch((e) => {
            })
    }, [])

    const DescriptionItem = ({title, content}) => (
        <>
            <div style={{display: 'inline-flex'}}>
                <b>
                    <p>{title}:</p>
                </b>

                &nbsp;
                {content}

            </div>
            <br/>
        </>
    );

    const TrainingCourse = () => {
        const {Column, ColumnGroup} = Table;
        let data = trainingProgram.courses.map((course, index) => {
            return {
                key: course.uuid,
                stt: index + 1,
                course_code: course.course_code,
                course_name: course.course_name_vi,
                credits: course.credits,
                theory_time: course.training_program_course.theory_time,
                exercise_time: course.training_program_course.exercise_time,
                practice_time: course.training_program_course.practice_time,
            }
        })
        return (
            <>
                <Title level={3}>
                    II. Nội dung chương trình đào tạo
                </Title>
                <Title level={4}>
                    2.1. Khung CTĐT
                </Title>
                <Table dataSource={data} bordered pagination={false}>
                    <Column title="STT" dataIndex="stt" key="stt"/>
                    <Column title="Mã học phần" dataIndex="course_code" key="course_code"/>
                    <Column title="Học phần" dataIndex="course_name" key="course_name"/>
                    <Column title="Số tín chỉ" dataIndex="credits" key="credits"/>
                    <ColumnGroup title="Số giờ tín chỉ">
                        <Column title="Lý thuyết" dataIndex="theory_time" key="theory_time"/>
                        <Column title="Bài tập" dataIndex="exercise_time" key="exercise_time"/>
                        <Column title="Thực hành" dataIndex="practice_time" key="practice_time"/>
                    </ColumnGroup>

                    {/*<Column title="Address" dataIndex="address" key="address"/>
                    <Column
                        title="Tags"
                        dataIndex="tags"
                        key="tags"
                        render={tags => (
                            <>
                                {tags.map(tag => (

                                    <Tag color="blue" key={tag}>
                                        {tag}
                                    </Tag>

                                ))}
                            </>
                        )}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                <a>Invite {record.lastName}</a>
                                <a>Delete</a>
                            </Space>
                        )}
                    />*/}
                </Table>
            </>
        )
    }


    if (trainingProgram) {
        const {
            vn_name,
            en_name,
            training_program_code,
            graduation_title,
            duration,
            graduation_diploma_en,
            graduation_diploma_vi,
            admission_method,
            admission_scale,
            common_destination,
            specific_destination,
            institution
        } = trainingProgram

        return (
            <>
                <Title level={3}>
                    PHẦN I: GIỚI THIỆU CHUNG VỀ CHƯƠNG TRÌNH ĐÀO TẠO
                </Title>
                <Title level={4}>
                    1. Một số thông tin về chương trình đào tạo
                </Title>
                <Row>
                    <Col offset={1} span={20}>
                        <DescriptionItem title="Tên ngành đào tạo (VI)" content={vn_name}/>
                        <DescriptionItem title="Tên ngành đào tạo (EN)" content={en_name}/>
                        <DescriptionItem title="Mã ngành đào tạo" content={training_program_code}/>
                        <DescriptionItem title="Danh hiệu tốt nghiệp" content={graduation_title}/>
                        <DescriptionItem title="Thời gian đào tạo" content={duration + " năm"}/>
                        <DescriptionItem title="Tên văn bằng tốt nghiệp (VI)" content={graduation_diploma_vi}/>
                        <DescriptionItem title="Tên văn bằng tốt nghiệp (EN)" content={graduation_diploma_en}/>
                        <DescriptionItem title="Đơn vị được giao nhiệm vụ đào tạo"
                                         content={"Trường Đại học Công nghệ, ĐHQGHN"}/>
                    </Col>
                </Row>

                <Title level={4}>
                    2. Mục tiêu của chương trình đào tạo
                </Title>
                <Title level={5}>
                    2.1. Mục tiêu chung
                </Title>
                <Row>
                    <Col offset={1} span={20}>
                        <div id={"common_destination"}>
                            {Parser(common_destination)}
                        </div>

                    </Col>
                </Row>
                <Title level={5}>
                    2.2. Mục tiêu cụ thể
                </Title>
                <Row>
                    <Col offset={1} span={20}>
                        <div id={"specific_destination"}>
                            {Parser(specific_destination)}
                        </div>
                    </Col>
                </Row>

                <Title level={4}>
                    3. Thông tin tuyển sinh
                </Title>
                <Col offset={1} span={20}>
                    <DescriptionItem title="Hình thức tuyển sinh" content={admission_method}/>
                    <DescriptionItem title="Dự kiến quy mô tuyển sinh" content={admission_scale}/>
                </Col>
                <br/>
                <TrainingCourse/>
            </>
        )
    } else {
        return "";
    }
}

export default DetailTrainingProgramPage;

