import React, {useEffect, useState} from 'react'
import axios from "axios";
import {useParams} from "react-router";
import {Affix, Button, Col, Row, Spin, Table} from "antd";
import Title from "antd/lib/typography/Title";
import Parser from 'html-react-parser';
import {useHistory} from "react-router-dom";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {EditOutlined, FilePdfOutlined} from "@ant-design/icons";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import Cookies from "universal-cookie";


const DetailTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    let history = useHistory();

    const [trainingProgram, setTrainingProgram] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const {currentUser, userRole} = useSelector(state => state.auth);

    useEffect(() => {
        setLoading(true)
        axios.get(`/training-programs/${uuid}`)
            .then((res) => {
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
                    Khung chương trình đào tạo
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
                </Table>
            </>
        )
    }

    const TrainingLOC = ({learning_outcomes}) => {
        const dispatch = useDispatch();
        const [locs, setLocs] = useState([]);
        const [data, setData] = useState(learning_outcomes)
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

                <Table
                    pagination={false}
                    columns={columns}
                    dataSource={data}
                    expandable={{indentSize: 40}}
                />
            </>
        )

    }

    const CourseDocument = ({courses, semester}) => {
        const columns = [
            {
                title: 'STT',
                render: (value, row, index) => index + 1,
                width: 80
            },
            {
                title: 'Mã học phần',
                dataIndex: 'course_code',
                width: 200
            },
            {
                title: 'Tên học phần (vi)',
                dataIndex: 'course_name_vi',
            },
            {
                title: 'Số tín chỉ',
                dataIndex: 'credits',
                width: 100
            },
            {
                title: 'Tài liệu tham khảo',
                dataIndex: ['training_program_course', 'documents'],
                width: '50%'
            },

        ]

        if (semester) {
            columns.pop();
        }

        return !semester ? (
            <>
                <Title level={4}>
                    {"Danh mục tài liệu tham khảo"}
                </Title>
                <Table
                    columns={columns}
                    dataSource={courses.map((course) => {
                        course.key = course.uuid
                        return course;
                    })}
                    bordered
                    pagination={false}
                />
            </>
        ) : (
            <>
                <Title level={4}>
                    {"Trình tự đào tạo dự kiến"}
                </Title>

                {
                    new Array(trainingProgram.training_duration * 2).fill(undefined).map((_, index) => {
                        return (
                            <>
                                <Title level={5}>{`Kỳ ${index + 1}`}</Title>
                                <Row>
                                    <Col span={15} offset={2}>
                                        <Table
                                            columns={columns}
                                            dataSource={
                                                courses
                                                    .filter((course) => course.training_program_course.semester === index + 1)
                                                    .map((course) => {
                                                        course.key = course.uuid
                                                        return course;
                                                    })}
                                            bordered
                                            pagination={false}
                                            footer={() => {
                                                return <Row align="end">
                                                    Tổng số tín chỉ: &nbsp;
                                                    <b>
                                                        {
                                                            courses
                                                                .filter((course) => course.training_program_course.semester === index + 1)
                                                                .map(course => course.credits)
                                                                .reduce((c1, c2) => (c1 + c2), 0)
                                                        }
                                                    </b>
                                                </Row>

                                            }}
                                        />
                                    </Col>
                                </Row>
                                <br/>
                            </>
                        )
                    })
                }
            </>
        )
    }

    const Lecturers = ({courses}) => {
        const [dataSource, setDataSource] = useState([])
        useEffect(() => {
            let mix = [];
            for (let course of courses) {
                let lecturers = JSON.parse(course.training_program_course.lecturers);
                course.lecturers = lecturers;
                if (lecturers) {
                    for (let lecturer of lecturers) {
                        mix.push({...course, ...lecturer, courseUuid: course.uuid, lecturerUuid: lecturer.uuid})
                        setDataSource(
                            mix
                        )
                    }
                } else {
                    mix.push({...course, courseUuid: course.uuid})
                    setDataSource(mix)
                }
            }

        }, [])

        useEffect(() => {
            console.log(">>>", dataSource)
        }, [dataSource])

        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };

            obj.props.rowSpan = dataSource[index].lecturers ? dataSource[index].lecturers.length : 1;

            if (index > 0) {
                if (dataSource[index].courseUuid === dataSource[index - 1].courseUuid) {
                    obj.props.rowSpan = 0;
                }
            }

            return obj;
        }
        const columns = [
            {
                title: 'STT',
                dataIndex: 'stt',
                //render: renderContent,
            },
            {
                title: 'Mã học phần',
                dataIndex: 'course_code',
                render: renderContent,
            },
            {
                title: 'Tên học phần (vi)',
                dataIndex: 'course_name_vi',
                render: renderContent,
            },
            {
                title: 'Số tín chỉ',
                dataIndex: 'credits',
                render: renderContent,
            },
            {
                title: 'Cán bộ giảng dạy',
                colSpan: 3,
                children: [
                    {
                        title: "Họ và tên",
                        dataIndex: 'fullname'
                    },
                    {
                        title: "Học vị",
                        dataIndex: "academic_rank"
                    },
                    {
                        title: "Đơn vị công tác",
                        dataIndex: ['institution', 'vn_name']
                    }
                ]
            },
        ]

        return (
            <>
                <Title level={4}>
                    Đội ngũ cán bộ giảng dạy
                </Title>
                <Table
                    columns={columns}
                    dataSource={dataSource.map((course, index) => {
                        course.key = index;
                        course.stt = index + 1;
                        return course;
                    })}
                    bordered
                    pagination={false}
                />
            </>
        )
    }

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

                /*
                Here are the numbers (paper width and height) that I found to work.
                It still creates a little overlap part between the pages, but good enough for me.
                if you can find an official number from jsPDF, use them.
                */
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
                doc.save( 'file.pdf');
                setIsExportingPdf(false);
            })
        ;

    }

    if (trainingProgram) {
        const {
            vn_name,
            en_name,
            training_program_code,
            graduation_title,
            training_duration,
            graduation_diploma_en,
            graduation_diploma_vi,
            admission_method,
            admission_scale,
            common_destination,
            specific_destination,
            institution,
            learning_outcomes,
            courses
        } = trainingProgram

        return loading ? <Spin/> : (
            <div id="training_program">
                {
                   (!trainingProgram.lock_edit && userRole == 0) ? <Affix style={{float: 'right'}} offsetTop={100}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined/>}
                            style={{float: 'right'}}
                            onClick={() => history.push(`/uet/training-programs/updating/${trainingProgram.uuid}`)}
                        />
                    </Affix> : ""
                }
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
                        <DescriptionItem title="Thời gian đào tạo" content={training_duration + " năm"}/>
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
                        <div id="common_destination">
                            {common_destination}
                        </div>
                    </Col>
                </Row><br/>
                <Title level={5}>
                    2.2. Mục tiêu cụ thể
                </Title>
                <Row>
                    <Col offset={1} span={20}>
                        <div id={"specific_destination"}>
                            {specific_destination}
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
                <Title level={3}>
                    II. Chuẩn đầu ra của CTĐT
                </Title>
                <TrainingLOC learning_outcomes={learning_outcomes}/>
                <br/>
                <TrainingCourse/><br/><br/>
                <CourseDocument courses={courses}/><br/><br/>
                <Lecturers courses={courses}/><br/><br/>
                <CourseDocument courses={courses} semester={true}/><br/><br/>
                <Row align="end">
                    <Button icon={<FilePdfOutlined />} onClick={printDocument} loading={isExportingPdf}> Export PDF </Button>
                </Row>
            </div>
        )
    } else {
        return "";
    }
}

export default DetailTrainingProgramPage

