import {useState, useEffect} from 'react'
import axios from "axios";
import {useParams} from "react-router";
import {Affix, Button, Col, Row, Space, Spin, Table, Tag} from "antd";
import Title from "antd/lib/typography/Title";
import Parser from 'html-react-parser';
import {useHistory} from "react-router-dom";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";

const DetailTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    let history = useHistory();
    const [trainingProgram, setTrainingProgram] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        axios.get(`/training-programs/${uuid}`)
            .then((res) => {
                console.log(res.data)
                setTrainingProgram(res.data.trainingProgram)
            })
            .catch((e) => {
            })
            .finally(() => setLoading(false))
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
                    III. Nội dung chương trình đào tạo
                </Title>
                <Title level={4}>
                    3.1. Khung CTĐT
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

    const TrainingLOC = ({learning_outcomes}) =>
    {
        const dispatch = useDispatch();
        const [locs, setLocs] = useState([]);
        const [data, setData]=  useState(learning_outcomes)
        const state = useSelector(state => state.learningOutcomes);

        useEffect(() => {
            dispatch(actions.getAllLearningOutcomes(1));
        }, [])

        useEffect(() => {
            state.locs.forEach((loc) => {
                loc.key = loc.uuid;
                if (loc.children && loc.children.length > 0) {
                    loc.children.forEach((child) => {
                        child.children = [];
                        child.key = child.uuid
                        for (let oc of state.locs) {
                            if (child.uuid === oc.parent_uuid) {
                                child.children.push(oc);
                            }
                        }
                        if (child.children.length === 0) delete child.children;
                    })
                } else {
                    delete loc.children;
                }
            })

            setLocs(
                state.locs.filter((loc) => {
                    return loc.parent_uuid == null;
                })
            );


            console.log(data)
        }, [state])

        const columns = [
            {
                title: 'Nội dung',
                dataIndex: 'content',
                ellipsis: true,
                key: 'content',
            },
        ];

        return (
            <>
                <Title level={3}>
                    II. Chuẩn đầu ra của CTĐT
                </Title>

                <Table
                    pagination={false}
                    columns={columns}
                    dataSource={data}
                    expandable={{indentSize: 40}}
                />
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
            institution,
            learning_outcomes
        } = trainingProgram

        return loading ? <Spin /> : (
            <>
                <Affix style={{float: 'right'}} offsetTop={10}>
                    <Button type="primary" onClick={() => history.push(`/uet/training-programs/updating/${trainingProgram.uuid}`)}>
                        Edit
                    </Button>
                </Affix>
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
                <TrainingLOC learning_outcomes={learning_outcomes}/>
                <br/>
                <TrainingCourse/>
            </>
        )
    } else {
        return "";
    }
}

export default DetailTrainingProgramPage;

