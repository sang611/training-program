import {Col, Row, Spin} from "antd";
import {useEffect, useState, useMemo} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import {useParams} from "react-router";



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

    return !course ? <Spin /> : <>
        <Row>
            <Col offset={1} span={20}>
                <DescriptionItem title="Tên học phần (VI)" content={course.course_name_vi}/>
                <DescriptionItem title="Tên học phần (EN)" content={course.course_name_en}/>
                <DescriptionItem title="Mã học phần" content={course.course_code}/>
                <DescriptionItem title="Số tín chỉ" content={course.credits}/>
                <DescriptionItem title="Đơn vị phụ trách" content={course.institution.vn_name}/>
            </Col>
        </Row>
    </>


}

export default InforCourseOutline;