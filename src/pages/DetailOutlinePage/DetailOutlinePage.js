import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import {Affix, Button, message, Spin, Table} from "antd";
import Title from "antd/lib/typography/Title";
import InforCourseOutline from "../CreateOutlineCoursePage/InforCourseOutline";
import Parser from 'html-react-parser';
import TextArea from "antd/lib/input/TextArea";
import {EditOutlined} from "@ant-design/icons";

const Lecturers = ({lecturers}) => {

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Chức danh, học vị',
            dataIndex: 'academic_rank',
            key: 'academic_rank',
            render: (_, {academic_degree, academic_rank}) => {
                return (
                    <>
                        <span>{academic_degree ? `${academic_degree} - ` : ""}</span>
                        <span>{academic_rank ? academic_rank : ""}</span>
                    </>
                )
            }
        },
        {
            title: 'VNU mail',
            dataIndex: 'vnu_mail',
            key: 'vnu_mail',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
    ];

    return !lecturers ? <Spin/> : (
        <>
            <Table
                dataSource={
                    JSON.parse(lecturers).map((lec, index) => {
                        lec.stt = index + 1;
                        lec.key = lec.uuid;
                        return lec;
                    })
                }
                columns={columns}
                bordered
                pagination={false}
            />
        </>
    )
}

const LOCs = ({locs}) => {
    const columns = [
        {
            title: 'Mục tiêu, nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Bậc 1',
            key: 'level1',
            render: (_, record) => {
                return (
                    <>
                        {record.outline_learning_outcome.level === 1 ? 'X' : ""}
                    </>
                )
            }
        },
        {
            title: 'Bậc 2',
            key: 'level2',
            render: (_, record) => {
                return (
                    <>
                        {record.outline_learning_outcome.level === 2 ? 'X' : ""}
                    </>
                )
            }
        },
        {
            title: 'Bậc 3',
            key: 'level3',
            render: (_, record) => {
                return (
                    <>
                        {record.outline_learning_outcome.level === 3 ? 'X' : ""}
                    </>
                )
            }
        },
        {
            title: 'Bậc 4',
            key: 'level4',
            render: (_, record) => {
                return (
                    <>
                        {record.outline_learning_outcome.level === 4 ? 'X' : ""}
                    </>
                )
            }
        },
    ];
    return (
        <>
            <Table
                columns={columns}
                dataSource={locs.map((loc) => {
                    loc.key = loc.uuid;
                    return loc;
                })}
                pagination={false} bordered/>
        </>
    )
}

const DetailOutlinePage = () => {
    const history = useHistory();
    const {outlineUuid, uuid} = useParams();
    const [outline, setOutline] = useState(null);
    const {userRole} = useSelector(state => state.auth)
    const {user} = useSelector(state => state.accounts);

    useEffect(() => {

        axios
            .get(`/outlines/${uuid}/${outlineUuid}`)
            .then((res) => {
                setOutline(res.data.outline)
            })
            .catch(error => message.error("Đã có lỗi xảy ra"))

    }, [])

    const checkIsModerator = () => {
        if (userRole == 1 || userRole == 2)
            return !!(user.courses.find((course) => uuid == course.uuid).employee_course.isModerator)
        return false
    }

    return !outline ? <Spin/> : (
        <>
            {
                (userRole == 0 || checkIsModerator()) ?
                    <Affix style={{
                        float: 'right',
                    }} offsetTop={80}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined/>}
                            style={{float: 'right'}}
                            onClick={() => history.push(`/uet/courses/${uuid}/outlines/${outlineUuid}/updating`)}
                        />
                    </Affix> : ''
            }


            <br/>
            <Title level={4}>
                1. Thông tin về các giảng viên môn học
            </Title>
            <Lecturers lecturers={outline.lecturers}/> <br/>

            <Title level={4}>
                2. Thông tin chung về môn học
            </Title>
            <InforCourseOutline course={outline.course}/> <br/>

            <Title level={4}>
                3. Mục tiêu môn học
            </Title>
            {
                outline.goal ? Parser(outline.goal) : ''
            }
            <Title level={4}>
                4. Chuẩn đầu ra
            </Title>
            <LOCs locs={outline.learning_outcomes}/> <br/>

            <Title level={4}>
                5. Tóm tắt nội dung môn học
            </Title>

            {outline.summary_content}

            <Title level={4}>
                6. Nội dung chi tiết
            </Title>
            {
                outline.detail_content ? Parser(outline.detail_content) : ''
            }
            <Title level={4}>
                7. Học liệu
            </Title>
            {
                outline.documents ? Parser(outline.documents) : ''
            }

            <Title level={4}>
                8. Hình thức tổ chức dạy học
            </Title>
            {
                outline.teachingFormality ? Parser(outline.teachingFormality) : ''
            }
            <Title level={4}>
                9. Chính sách đối với môn học và các yêu cầu khác của giảng viên
            </Title>
            {
                outline.coursePolicy ? Parser(outline.coursePolicy) : ''
            }

            <Title level={4}>
                10. Phương pháp, hình thức kiểm tra, đánh giá kết quả học tập môn học
            </Title>
            {
                outline.examFormality ? Parser(outline.examFormality) : ''
            }

        </>
    )
}

export default DetailOutlinePage;
