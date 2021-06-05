import React, {useEffect, useState} from 'react'
import {useParams} from "react-router";
import {Affix, Anchor, Button, Col, message, Row, Skeleton, Space, Spin} from "antd";
import {useHistory} from "react-router-dom";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {EditOutlined, FilePdfOutlined, FileWordOutlined, LoadingOutlined} from "@ant-design/icons";
import DependencyCourseGraph from "./DependencyCourseGraph";
import SummaryContentCourse from "./SummaryContentCourse";
import TrainingProgramIntroduce from "./TrainingProgramIntroduce";
import TrainingLOC from "./TrainingLOC";
import TrainingCourse from "./TrainingCourse";
import CourseDocument from "./CourseDocument";
import CourseLecturer from "./CourseLecturer";
import Title from "antd/lib/typography/Title";
import {exportToDoc, printDocument} from "../../utils/export";
import CourseSequence from "./CourseSequence";


const DetailTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    let history = useHistory();
    const dispatch = useDispatch();

    const {trainingProgram, loadingATraining, errorLoadA} = useSelector(state => state.trainingPrograms)
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [isExportingDoc, setIsExportingDoc] = useState(false);
    const {userRole} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
    }, [uuid])

    if (loadingATraining) {
        return <>
            {/*<Skeleton active/>
            <Skeleton active/>
            <Skeleton active/>
            <Skeleton active/>*/}
            <center>
                <LoadingOutlined style={{fontSize: '60px', marginTop: '150px'}}/>
            </center>
        </>
    } else {
        if (!errorLoadA && trainingProgram) {
            const {
                learning_outcomes,
                courses,
                lock_edit,
                uuid
            } = trainingProgram

            return (
                <>
                    <Row>
                        <Col span={21}>
                            <div id="training_program" style={{padding: '20px'}}>
                                <div id="training_program_1">
                                    <TrainingProgramIntroduce/>
                                    <br/><br/>
                                    <TrainingLOC learning_outcomes={learning_outcomes}/>
                                    <br/><br/>
                                </div>
                                <div id="training_program_2">
                                    <TrainingCourse/>
                                    <br/><br/>
                                </div>
                                <div id="training_program_3">
                                    <CourseDocument courses={courses}/>
                                    <br/><br/>
                                </div>
                                <div id="training_program_4">
                                    <CourseLecturer courses={courses}/>
                                    <br/><br/>
                                </div>
                                <DependencyCourseGraph/>
                                <br/><br/>

                                <div id="training_program_5">
                                    <CourseSequence courses={courses}/>
                                    <br/><br/>
                                    <SummaryContentCourse/>
                                </div>


                            </div>
                            {/*<Row align="end">
                                <Space>
                                    <Button
                                        icon={<FilePdfOutlined/>}
                                        onClick={() => {
                                            setIsExportingPdf(true);
                                            printDocument("training_program").then(r => setIsExportingPdf(false))

                                        }}
                                        loading={isExportingPdf}
                                    >
                                        Export PDF
                                    </Button>
                                    <Button
                                        icon={<FileWordOutlined/>}
                                        onClick={() => {
                                            setIsExportingDoc(true);
                                            exportToDoc("training_program")
                                            setIsExportingDoc(false);
                                        }}
                                        loading={isExportingDoc}
                                    >
                                        Export Word
                                    </Button>
                                </Space>
                            </Row>*/}
                        </Col>
                        <Col span={3}>
                            <Anchor offsetTop={100} activeLink="#training-introduce">
                                <Anchor.Link href="#training-introduce" title="Giới thiệu chung"/>
                                <Anchor.Link href="#training-loc" title="Chuẩn đầu ra"/>
                                <Anchor.Link href="#training-course" title="Khung đào tạo"/>
                                <Anchor.Link href="#training-doc" title="Tài liệu giảng dạy"/>
                                <Anchor.Link href="#training-lec" title="Đội ngũ cán bộ"/>
                                <Anchor.Link href="#training-graph" title="Quan hệ học phần"/>
                                <Anchor.Link href="#training-sequence" title="Trình tự đào tạo"/>
                                <Anchor.Link href="#training-summary-content" title="Nội dung học phần"/>
                            </Anchor>

                            <Affix
                                style={{float: 'right'}}
                                offsetTop={580}
                            >
                                <Space direction="vertical">
                                    {
                                        (!lock_edit && userRole === 0) ?
                                            <Button
                                                type="primary"
                                                shape="circle"
                                                icon={<EditOutlined/>}
                                                onClick={() => history.push(`/uet/training-programs/updating/${uuid}`)}
                                            /> : ""
                                    }
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        danger
                                        icon={<FilePdfOutlined/>}
                                        onClick={() => {
                                            setIsExportingPdf(true);
                                            printDocument(
                                                [
                                                    "training_program_1",
                                                    "training_program_2",
                                                    "training_program_3",
                                                    "training_program_4",
                                                    "training_program_5",
                                                ]
                                            )
                                                .then()
                                                .catch(err => {
                                                    message.error(err.toString())
                                                })
                                                .finally(() => setIsExportingPdf(false))

                                        }}
                                        loading={isExportingPdf}
                                    >
                                    </Button>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        danger
                                        icon={<FileWordOutlined/>}
                                        onClick={() => {
                                            setIsExportingDoc(true);
                                            exportToDoc("training_program")
                                            setIsExportingDoc(false);
                                        }}
                                        loading={isExportingDoc}
                                    >
                                    </Button>
                                </Space>

                            </Affix>

                        </Col>
                    </Row>

                </>
            )
        } else {
            if (errorLoadA)
                return errorLoadA
            if (!trainingProgram) return <Spin/>
        }
    }


}

export default DetailTrainingProgramPage

