import Title from "antd/lib/typography/Title";
import {Col, Descriptions, Row} from "antd";

const SummaryContentCourse = ({trainingProgram}) => {

    function getLockedOutlineContent(course) {
        let outline;
        if(trainingProgram.lock_edit) {
           outline = course.outlines ? course.outlines.find(outline => outline.uuid === course.training_program_course.outlineUuid) : null;
        }
        else {
           outline = course.outlines[0] ? course.outlines[0] : null
        }

        return outline ? outline.summary_content : ''
    }

    return (
        <>
            <Title level={4}>
                Tóm tắt nội dung học phần
            </Title>
            <Row>
                <Col span={14} offset={2}>
                    {
                        trainingProgram.courses.map((course, index) => {
                            return (
                                <>
                                    <Descriptions
                                        title={`Số thứ tự: ${index+1}`}
                                        column={1}
                                        labelStyle={{fontWeight: 'bold'}}
                                    >
                                        <Descriptions.Item label="Mã học phần" contentStyle={{fontWeight: 'bold'}}>{course.course_code}</Descriptions.Item>
                                        <Descriptions.Item label="Tên học phần" contentStyle={{fontWeight: 'bold'}}>{course.course_name_vi}</Descriptions.Item>
                                        <Descriptions.Item label="Số tín chỉ" contentStyle={{fontWeight: 'bold'}}>{course.credits}</Descriptions.Item>
                                        <Descriptions.Item label="Học phần tiên quyết" contentStyle={{fontWeight: 'bold', display: 'block'}}>{
                                            function () {
                                                let required_course = JSON.parse(course.required_course)
                                                if(!required_course || required_course.length == 0) {
                                                    return "Không có"
                                                }
                                                else {
                                                    return required_course
                                                        .map(course => {
                                                            return <div>{`${course.course_code} - ${course.course_name_vi}`}</div>
                                                        })
                                                }
                                            }()
                                        }</Descriptions.Item>
                                        <Descriptions.Item label="Nội dung học phần">
                                            {
                                                getLockedOutlineContent(course)
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <br/><br/>
                                </>
                            )
                        })
                    }
                </Col>
            </Row>

        </>
    )
}

export default SummaryContentCourse;