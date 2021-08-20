import Title from "antd/lib/typography/Title";
import {Col, Row, Table} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {generateDataFrame} from "../../utils/frameCourse";
import TextArea from "antd/es/input/TextArea";

const CourseDocument = ({courses, semester}) => {
    let index_course_document = 1;
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 80
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
            width: '10%'
        },
        {
            title: 'Tên học phần (vi)',
            dataIndex: 'course_name_vi',
            width: '30%',
            render: (_, course) => {
                if (course.uuid) {
                    return (
                        <>
                            <div>{course.course_name_vi}</div>
                            <div>
                                <i>{course.course_name_en}</i>
                            </div>
                        </>
                    )
                } else {
                    if(course.h===1)
                        return <b>{course.course_name_vi}</b>
                    else if(course.h===2)
                        return <span style={{fontWeight: 500}}><i>{course.course_name_vi}</i></span>
                }
            }
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            width: 100,
            render: (_, course) => {
                if (course.uuid) return course.credits;
                else return <b>{course.credits}</b>
            }
        },
        {
            title: 'Tài liệu tham khảo',
            dataIndex: ['training_program_course', 'documents'],
            width: '40%',
            render: (_, course) => (
                course.uuid ? <TextArea
                    disabled
                    autoSize
                    style={{color: '#000', cursor: 'auto'}}
                    defaultValue={course.document_url || ""}
                /> : ''

            )
        },

    ]

    return (
        <div id="training-doc">
            <Title level={4}>
                {"Danh mục tài liệu tham khảo"}
            </Title>
            <Table
                columns={columns}
                dataSource={generateDataFrame(trainingProgram).map((course) => {
                    course.key = course.uuid
                    if(course.uuid) course.stt = index_course_document ++;
                    return course;
                })}
                bordered
                pagination={false}
            />
        </div>
    )

}

export default CourseDocument;