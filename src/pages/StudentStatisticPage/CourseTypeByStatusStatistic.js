import {Column} from "@ant-design/charts";
import {useEffect, useState} from 'react'

const CourseTypeByStatusStatistic = ({courses, trainingProgram, semes}) => {

    let [dataCreditsByStatus, setDataCreditsByStatus] = useState([]);
    const courseTypes = ['B', 'L', 'BT']

    function generateCreditsByStatus(statusCourse, courseTypes) {
        let courseByStatus = [];

        let result = {status: statusCourse}
        courseByStatus = courses.filter((course) => {
            let st = "";
            if(statusCourse == "Cải thiện") st = "improved";
            if(statusCourse == "Hoàn thành") st = "completed";
            if(statusCourse == "Học lại") st = "repeated";
            if(statusCourse == "Đang học") st = "working";
            return (course.student_course[st] > 0 && (semes == 0 || course.student_course.semester == semes))
        })

        courseTypes.forEach((type) => {
            let sumByType = 0;
            for(let course of courseByStatus) {
                let matchCourse = trainingProgram.courses.find(courseOfTraining => {
                    return courseOfTraining.uuid === course.uuid;
                })
                if(matchCourse && matchCourse.training_program_course.course_type == type) {
                    sumByType += course.credits
                }
            }
            result[type] = sumByType;
        })

        return result
    }

    function revertData (statusCourse) {

        let result = [];
        for (let type in statusCourse) {
            if(type != "status") {
                result.push({
                    status: statusCourse.status,
                    course_type: type == "B" ? "Bắt buộc" : (type == "L" ? "Tự chọn" : "Bổ trợ"),
                    value: statusCourse[type]
                })
            }

        }
        console.log(result)
        return result
    }

    useEffect(() => {
        let improvedCourse = generateCreditsByStatus('Cải thiện', courseTypes)
        let completeddCourse = generateCreditsByStatus('Hoàn thành', courseTypes)
        let repeatedCourse = generateCreditsByStatus('Học lại', courseTypes)
        let workingCourse = generateCreditsByStatus('Đang học', courseTypes)

        setDataCreditsByStatus(
            [
                ...revertData(improvedCourse),
                ...revertData(completeddCourse),
                ...revertData(repeatedCourse),
                ...revertData(workingCourse)
            ]

        )
    }, [semes, courses]);


    var config = {
        data: dataCreditsByStatus,
        xField: 'status',
        yField: 'value',
        seriesField: 'course_type',
        isStack: true,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.value;
            },
            style: { fill: '#303030' },
        },

    };
    return (
        <>
            <Column {...config} />
        </>
    )
}

export default CourseTypeByStatusStatistic;
