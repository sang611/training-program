import React, {useEffect, useState} from "react";
import Title from "antd/lib/typography/Title";
import {Table} from "antd";
import {useSelector} from "react-redux";

const CourseLecturer = () => {
    const [dataSource, setDataSource] = useState([])
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    let indexRow = 1;
    useEffect(() => {
        let mix = [];
        for (let course of trainingProgram.courses) {
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

    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            props: {},
        };

        obj.props.rowSpan = dataSource[index].lecturers ? dataSource[index].lecturers.length : 1;



        if (index > 0) {
            if (dataSource[index].courseUuid === dataSource[index - 1].courseUuid) {
                obj.props.rowSpan = 0;
                indexRow --;
            }
        }

        return obj;
    }
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: renderContent,
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

                    if (index > 0 && dataSource[index].courseUuid === dataSource[index - 1].courseUuid) {
                        course.stt = indexRow - 1;
                    }
                    else {
                        course.stt = indexRow ++;
                    }
                    return course;
                })}
                bordered
                pagination={false}
            />
        </>
    )
}

export default CourseLecturer;