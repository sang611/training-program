import {Col, Row, Spin} from "antd";


const DescriptionItem = ({title, content}) => (
    <>
        <div style={{display: 'inline-flex'}}>
            <b>
                <p>{title}:</p>
            </b>

            &ensp;
            {content}
        </div>
        <br/>
    </>
);
const InforCourseOutline = ({courseUuid, course}) => {
    const {course_name_vi, course_name_en, course_code, credits, institution} = course;
    return !course ? <Spin /> : <>
        <Row>
            <Col offset={1} span={20}>
                <DescriptionItem title="Tên học phần (VI)" content={course_name_vi}/>
                <DescriptionItem title="Tên học phần (EN)" content={course_name_en}/>
                <DescriptionItem title="Mã học phần" content={course_code}/>
                <DescriptionItem title="Số tín chỉ" content={credits}/>
                <DescriptionItem title="Đơn vị phụ trách" content={institution ? institution.vn_name : ''}/>
            </Col>
        </Row>
    </>


}

export default InforCourseOutline;
