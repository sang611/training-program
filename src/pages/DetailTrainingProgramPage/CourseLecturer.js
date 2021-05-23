import React, {useEffect, useState} from "react";
import Title from "antd/lib/typography/Title";
import {Table} from "antd";
import {useSelector} from "react-redux";
import {generateDataFrame} from "../../utils/frameCourse";

const CourseLecturer = () => {
    const [dataSource, setDataSource] = useState([])
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    let indexRow = 1;
    useEffect(() => {
        let mix = [];
        for (let course of generateDataFrame(trainingProgram)) {
            if (course.uuid) {
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
            } else {
                mix.push({...course})
            }

        }

    }, [])

    const renderContent = (value, row, index, dataIndex) => {
        const obj = {
            children: value,
            props: {},
        };

        obj.props.rowSpan = row.lecturers ? row.lecturers.length : 1;

        if (index > 0 && row.uuid) {
            if (row.courseUuid === dataSource[index - 1].courseUuid) {
                obj.props.rowSpan = 0;
                indexRow--;
            }

        }

        switch (dataIndex) {
            case 'course_name_vi':
                if (row.uuid) {
                    obj.children = (
                        <>
                            <div>{row.course_name_vi}</div>
                            <div>
                                <i>{row.course_name_en}</i>
                            </div>
                        </>
                    )
                } else {
                    if (row.h === 1)
                        obj.children = <b>{row.course_name_vi}</b>
                    else if (row.h === 2)
                        obj.children = <span style={{fontWeight: 500}}><i>{row.course_name_vi}</i></span>
                }
                break;
            case 'credits':
                if (row.uuid) obj.children = row.credits;
                else obj.children = <b>{row.credits}</b>;
                break;
            default:
        }

        return obj;
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: renderContent
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
            width: '10%',
            render: renderContent,
        },
        {
            title: 'Tên học phần (vi)',
            dataIndex: 'course_name_vi',
            width: '25%',
            render: (value, row, index) => renderContent(value, row, index, 'course_name_vi'),
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            render: (value, row, index) => renderContent(value, row, index, 'credits'),
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
        <div id="training-lec">
            <Title level={4}>
                Đội ngũ cán bộ giảng dạy
            </Title>
            <Table
                columns={columns}
                dataSource={dataSource.map((course, index) => {
                    course.key = index;
                    if (course.uuid) {
                        if (index > 0 && dataSource[index].courseUuid === dataSource[index - 1].courseUuid) {
                            course.stt = indexRow - 1;
                        } else {
                            course.stt = indexRow++;
                        }

                    }
                    return course;
                })}
                bordered
                pagination={false}
            />
        </div>
    )
}

export default CourseLecturer;