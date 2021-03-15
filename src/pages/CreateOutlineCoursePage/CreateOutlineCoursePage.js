import Title from "antd/lib/typography/Title";
import AddLecturerOutlineForm from "./AddLecturerOutlineForm";
import InforCourseOutline from "./InforCourseOutline";
import {Button, Col, message, Row, Space, Spin} from "antd";
import {useParams} from "react-router";
import ContentCourse from "./ContentCourse";
import LOCOfCourse from "./LOCOfCourse";
import TextArea from "antd/lib/input/TextArea";
import React, {useState, useEffect, useMemo} from 'react';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import {useHistory} from "react-router-dom";


const CreateOutlineCoursePage = () => {
    const history = useHistory();
    const {uuid} = useParams();

    const [lecturers, setLecturers] = useState([]);
    const [goal, setGoal] = useState("");
    const [locs, setLoc] = useState([]);
    const [summaryContent, setSummaryContent] = useState("");
    const [detailContent, setDetailContent] = useState("");
    const [documents, setDocument] = useState("");
    const [teachingFormality, setTeachingFormality] = useState("");
    const [coursePolicy, setCoursePolicy] = useState("");
    const [examFormality, setExamFormality] = useState("");

    const dispatch = useDispatch();
    const {loadingACourse, course} = useSelector(state => state.courses)

    useEffect(() => {
        dispatch(actions.getACourse({courseUuid: uuid}))
    }, [])

    const onSubmitOutline = () => {
        const data = {
            lecturers,
            goal,
            locs,
            summaryContent,
            detailContent,
            documents,
            teachingFormality,
            coursePolicy,
            examFormality,
            courseUuid: uuid
        };


        axios.post("/outlines", data)
            .then((res) => {
                message.success(res.data.message);
            })
            .catch((err) => message.error("Đã có lỗi xảy ra"))
    }


    return loadingACourse === false ? (
        <>
            <Title level={2}>
                {`Tạo đề cương học phần ${course.course_name_vi} - ${course.course_code}`}
            </Title>
            <Title level={4}>
                1. Giảng viên phụ trách môn học
            </Title>
            <AddLecturerOutlineForm setLecturers={setLecturers}/>
            <br/><br/>

            <Title level={4}>
                2. Thông tin chung về môn học
            </Title>
            {
                <InforCourseOutline courseUuid={uuid} course={course}/>

            }

            <br/>

            <Title level={4}>
                3. Mục tiêu môn học
            </Title>
            <ContentCourse setGoal={setGoal}/>
            <br/><br/>

            <Title level={4}>
                4. Chuẩn đầu ra
            </Title>
            <LOCOfCourse setLoc={setLoc}/>
            <br/>

            <Title level={4}>
                5. Tóm tắt nội dung môn học
            </Title>
            <TextArea style={{width: '60%'}} rows="8" onChange={(e) => {
                setSummaryContent(e.target.value)
            }}/>
            <br/><br/>

            <Title level={4}>
                6. Nội dung chi tiết môn học
            </Title>
            <ContentCourse setDetailContent={setDetailContent}/>
            <br/><br/>

            <Title level={4}>
                7. Học liệu
            </Title>
            <TextArea style={{width: '60%'}} rows="8" onChange={(e) => {
                setDocument(e.target.value)
            }}/>
            <br/><br/>

            <Title level={4}>
                8. Hình thức tổ chức dạy học
            </Title>
            <ContentCourse setTeachingFormality={setTeachingFormality}/>
            <br/><br/>

            <Title level={4}>
                9. Chính sách đối với môn học và các yêu cầu khác của giảng viên
            </Title>
            <TextArea style={{width: '60%'}} rows="8" onChange={(e) => {
                setCoursePolicy(e.target.value)
            }}/>
            <br/><br/>

            <Title level={4}>
                10. Phương pháp, hình thức kiểm tra, đánh giá kết quả học tập môn học
            </Title>
            <ContentCourse setExamFormality={setExamFormality}/>
            <br/><br/>
            <Row justify="space-between">
                <Button onClick={() => history.push(`/uet/courses/${uuid}/outlines`)}>Thoát</Button>
                    <Button type="primary" onClick={onSubmitOutline}>Lưu</Button>

            </Row>

        </>
    ) : <Spin />
}

export default CreateOutlineCoursePage;