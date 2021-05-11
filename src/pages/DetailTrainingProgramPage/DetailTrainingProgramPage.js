import React, {useEffect, useState} from 'react'
import {useParams} from "react-router";
import {Affix, Button, Row, Skeleton, Space, Spin} from "antd";
import {useHistory} from "react-router-dom";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {EditOutlined, FilePdfOutlined, FileWordOutlined} from "@ant-design/icons";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import DependencyCourseGraph from "./DependencyCourseGraph";
import SummaryContentCourse from "./SummaryContentCourse";
import TrainingProgramIntroduce from "./TrainingProgramIntroduce";
import TrainingLOC from "./TrainingLOC";
import TrainingCourse from "./TrainingCourse";
import CourseDocumentAndSequence from "./CourseDocumentAndSequence";
import CourseLecturer from "./CourseLecturer";
import Title from "antd/lib/typography/Title";


const DetailTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    let history = useHistory();
    const dispatch = useDispatch();

    const {trainingProgram, loadingATraining, errorLoadA} = useSelector(state => state.trainingPrograms)
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const {userRole} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
    }, [uuid])


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
                var x = 0, y = 0;

                doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    y = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save('file.pdf');
                setIsExportingPdf(false);
            })
        ;

    }


    function exportToDoc() {
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";

        var footer = "</body></html>";

        var html = header + document.getElementById('training_program').innerHTML + footer;

        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });

        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

        // Specify file name
        let filename = 'document.doc';

        // Create download link element
        var downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);
    }

    if(loadingATraining) {
        return <>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
        </>
    }

    else {
        if (!errorLoadA && trainingProgram) {
            const {
                learning_outcomes,
                courses,
                lock_edit,
                uuid
            } = trainingProgram

            return (
                <>
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
                    <div id="training_program" style={{padding: '20px'}}>
                        <TrainingProgramIntroduce/>
                        <br/><br/>
                        <TrainingLOC learning_outcomes={learning_outcomes}/>
                        <br/><br/>
                        <TrainingCourse />
                        <br/><br/>
                        <CourseDocumentAndSequence courses={courses}/>
                        <br/><br/>
                        <CourseLecturer courses={courses}/>
                        <br/><br/>
                        <DependencyCourseGraph />
                        <br/><br/>
                        <CourseDocumentAndSequence courses={courses} semester={true} />
                        <br/><br/>
                        <SummaryContentCourse />
                    </div>
                    <Row align="end">
                        <Space>
                            <Button icon={<FilePdfOutlined/>} onClick={printDocument} loading={isExportingPdf}>Export
                                PDF</Button>
                            <Button icon={<FileWordOutlined/>} onClick={exportToDoc}>Export Word</Button>
                        </Space>
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

