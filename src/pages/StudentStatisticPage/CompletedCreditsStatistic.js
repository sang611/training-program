import {Pie} from "@ant-design/charts";
import {useEffect, useState} from "react";

const CompletedCreditsStatistic = ({trainingProgram, courses}) => {


    const [BTotal, setBTotal] = useState(0);
    const [LTotal, setLTotal] = useState(0);
    const [BTTotal, setBTTotal] = useState(0);

    const [BTotal_, setBTotal_] = useState(0);
    const [LTotal_, setLTotal_] = useState(0);
    const [BTTotal_, setBTTotal_] = useState(0);

    useEffect(() => {
        let b=0, l=0, bt=0;
        trainingProgram.courses.forEach(course => {
                switch (course.training_program_course.course_type) {
                    case "B":
                        b += course.credits
                        break;
                    case "L":
                        l += course.credits
                        break;
                    case "BT":
                        bt += course.credits
                        break;
                    default:
                        break;
                }
            }
        )
        setBTotal(b);setLTotal(l);setBTTotal(bt);

        let b_=0, l_=0, bt_=0;
        for(let course of courses) {
            if(course.student_course.completed) {
                let matchCourse = trainingProgram.courses.find(courseOfTraining => {
                    return courseOfTraining.uuid === course.uuid;
                })

                if (matchCourse) {
                    switch (matchCourse.training_program_course.course_type) {
                        case "B":
                            b_ += course.credits
                            break;
                        case "L":
                            l_ += course.credits
                            break;
                        case "BT":
                            bt_ += course.credits
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        setBTotal_(b_);setLTotal_(l_);setBTTotal_(bt_);
    }, [])

    var data = [
        {
            type: 'Bắt buộc',
            value: BTotal - BTotal_,
        },
        {
            type: 'Tự chọn',
            value: trainingProgram.require_L - LTotal_,
        },
        {
            type: 'Bổ trợ',
            value: trainingProgram.require_BT - BTTotal_,
        },

    ];
    var config = {
        appendPadding: 10,
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                formatter: function formatter() {
                    return 'Số tín chỉ còn thiếu';
                },
            },
        },
    };

    return (
        <>
            <Pie {...config} />
        </>
    )
}

export default CompletedCreditsStatistic;