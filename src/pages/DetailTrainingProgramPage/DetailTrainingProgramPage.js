import React, {useEffect, useState} from 'react'
import {useParams} from "react-router";
import {Affix, Button, Row, Spin} from "antd";
import {useHistory} from "react-router-dom";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {EditOutlined, FilePdfOutlined} from "@ant-design/icons";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import DependencyCourseGraph from "./DependencyCourseGraph";
import SummaryContentCourse from "./SummaryContentCourse";
import TrainingProgramIntroduce from "./TrainingProgramIntroduce";
import TrainingLOC from "./TrainingLOC";
import TrainingCourse from "./TrainingCourse";
import CourseDocumentAndSequence from "./CourseDocumentAndSequence";
import CourseLecturer from "./CourseLecturer";


const DetailTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    let history = useHistory();
    const dispatch = useDispatch();

    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const {currentUser, userRole} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
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







    function printDocument() {
        setIsExportingPdf(true);
        const input = document.getElementById('training_program');
        html2canvas(input, {
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        })
            .then((canvas) => {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;

                var doc = new jsPDF('p', 'mm');
                var position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save('file.pdf');
                setIsExportingPdf(false);
            })
        ;

    }

    if (trainingProgram) {
        const {
            learning_outcomes,
            courses,
            lock_edit,
            uuid
        } = trainingProgram

        return (
            <div id="training_program">
                {
                    (!lock_edit && userRole == 0) ? <Affix style={{float: 'right'}} offsetTop={100}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined/>}
                            style={{float: 'right'}}
                            onClick={() => history.push(`/uet/training-programs/updating/${uuid}`)}
                        />
                    </Affix> : ""
                }
                <TrainingProgramIntroduce />
                <br/><br/>
                <TrainingLOC learning_outcomes={learning_outcomes}/>
                <br/><br/>
                <TrainingCourse/>
                <br/><br/>
                <CourseDocumentAndSequence courses={courses}/>
                <br/><br/>
                <CourseLecturer courses={courses}/>
                <br/><br/>
                <DependencyCourseGraph trainingProgram={trainingProgram} />
                <br/><br/>
                <CourseDocumentAndSequence courses={courses} semester={true}/>
                <br/><br/>
                <SummaryContentCourse trainingProgram={trainingProgram} />
                <Row align="end">
                    <Button icon={<FilePdfOutlined/>} onClick={printDocument} loading={isExportingPdf}> Export
                        PDF </Button>
                </Row>
            </div>
        )
    } else {
        return <Spin />;
    }
}

export default DetailTrainingProgramPage

