import {useHistory, useParams} from "react-router-dom";
import {useState, useEffect} from 'react';
import axios from "axios";
import {Button, Col, message, notification, Row, Spin} from "antd";
import Title from "antd/lib/typography/Title";
import AddLecturerOutlineForm from "../CreateOutlineCoursePage/AddLecturerOutlineForm";
import InforCourseOutline from "../CreateOutlineCoursePage/InforCourseOutline";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import ContentCourse from "../CreateOutlineCoursePage/ContentCourse";
import TextArea from "antd/lib/input/TextArea";
import LOCOfCourse from "../CreateOutlineCoursePage/LOCOfCourse";

const UpdateOutlinePage = () => {
    const history = useHistory();
    const {uuid, outlineUuid} = useParams();
    const {userRole} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts)
    const [outline, setOutline] = useState(null);
    const [loading, setLoading] = useState(true);

    const [lecturers, setLecturers] = useState([]);
    const [goal, setGoal] = useState("");
    const [locs, setLoc] = useState([]);
    const [summaryContent, setSummaryContent] = useState("");
    const [detailContent, setDetailContent] = useState("");
    const [documents, setDocument] = useState("");
    const [teachingFormality, setTeachingFormality] = useState("");
    const [coursePolicy, setCoursePolicy] = useState("");
    const [examFormality, setExamFormality] = useState("");
    const [descriptionEdit, setDescriptionEdit] = useState(null);

    const dispatch = useDispatch();
    const {course} = useSelector(state => state.courses)

    useEffect(() => {
        dispatch(actions.getACourse({courseUuid: uuid}))
        dispatch(actions.getAllLearningOutcomes({typeLoc: 2, content: "", title: "", page: 1}))
    }, [])

    useEffect(() => {
        axios
            .get(`/outlines/${uuid}/${outlineUuid}`)
            .then((res) => {
                setOutline(res.data.outline)

            })
            .catch(error => {
                message.error("Đã có lỗi xảy ra")
                setLoading(false);
            })
            .finally(() => setLoading(false))

    }, [])

    useEffect(() => {
        if (outline) {
            setSummaryContent(outline.summary_content);
            setDocument(outline.documents);
            setCoursePolicy(outline.coursePolicy)
        }
    }, [outline])

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
            courseUuid: uuid,
            description_edit: descriptionEdit,
            userRole: userRole,
            outlineUuid: outline.uuid,
            userRequestId: user.uuid
        };

        axios.post("/outlines", data)
            .then((res) => {
                if(userRole > 0) {

                    notification.success({
                        message: res.data.message,
                        description: "Cập nhật sẽ được thực hiện sau khi admin chấp nhận!"
                    });
                }
                else {
                    message.success(res.data.message)
                }
            })
            .catch((err) => message.error("Đã có lỗi xảy ra"))
    }

    return loading === true ? <Spin/> : (
        <>
            <Title level={4}>
                1. Giảng viên phụ trách môn học
            </Title>
            <AddLecturerOutlineForm setLecturers={setLecturers} lecturers={outline.lecturers}/>
            <br/><br/>

            <Title level={4}>
                2. Thông tin chung về môn học
            </Title>
            {
                <InforCourseOutline courseUuid={uuid} course={course}/>
            }

            <Title level={4}>
                3. Mục tiêu môn học
            </Title>
            <ContentCourse setGoal={setGoal} content={outline.goal}/>
            <br/><br/>

            <Title level={4}>
                4. Chuẩn đầu ra
            </Title>
            <LOCOfCourse setLoc={setLoc} learning_outcomes={outline.learning_outcomes}/>
            <br/>

            <Title level={4}>
                5. Tóm tắt nội dung môn học
            </Title>
            <TextArea
                value={summaryContent}
                style={{width: '70%'}}
                rows="8"
                onChange={(e) => {
                    setSummaryContent(e.target.value)
                }}/>
            <br/><br/>

            <Title level={4}>
                6. Nội dung chi tiết
            </Title>
            <ContentCourse setDetailContent={setDetailContent} content={outline.detail_content}/>
            <br/><br/>

            <Title level={4}>
                7. Học liệu
            </Title>
            <TextArea
                value={documents}
                style={{width: '70%'}}
                rows="8"
                onChange={(e) => {
                    setDocument(e.target.value)
                }}/>

            <br/><br/>

            <Title level={4}>
                8. Hình thức tổ chức dạy học
            </Title>
            <ContentCourse setTeachingFormality={setTeachingFormality} content={outline.teachingFormality}/>
            <br/><br/>

            <Title level={4}>
                9. Chính sách đối với môn học và các yêu cầu khác của giảng viên
            </Title>
            <TextArea
                value={coursePolicy}
                style={{width: '70%'}}
                rows="8"
                onChange={(e) => {
                    setCoursePolicy(e.target.value)
                }}/>
            <br/><br/>

            <Title level={4}>
                10. Phương pháp, hình thức kiểm tra, đánh giá kết quả học tập môn học
            </Title>
            <ContentCourse setExamFormality={setExamFormality} content={outline.examFormality}/>
            <br/><br/>

            {
               userRole > 0 ?
                   <>
                       <Title level={4}>
                           Mô tả những phần đã chỉnh sửa
                       </Title>
                       <Row>
                           <Col span={16}>
                               <TextArea
                                   rows="8"
                                   onChange={(e) => {
                                       setDescriptionEdit(e.target.value)
                                   }}
                               />
                           </Col>
                       </Row>
                       <br/><br/>
                   </> : ''
            }

            <Row justify="space-between">
                <Button onClick={() => history.push(`/uet/courses/${uuid}/outlines`)}>Thoát</Button>
                <Button type="primary" onClick={onSubmitOutline}>Lưu</Button>
            </Row>
        </>
    )
}

export default UpdateOutlinePage;
