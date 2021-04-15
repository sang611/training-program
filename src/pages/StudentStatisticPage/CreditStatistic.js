import {useEffect, useState} from "react";
import {Pie} from "@ant-design/charts";

const CreditStatistic = ({courses, semes}) => {
    const [completed, setCompleted] = useState(0);
    const [improved, setImproved] = useState(0);
    const [repeated, setRepeated] = useState(0);
    const [working, setWorking] = useState(0);

    useEffect(() => {
        let w = 0, c = 0, i = 0, r = 0;
        for(let course of courses) {
            if(semes == 0 || course.student_course.semester == semes) {
                if (course.student_course.working) {
                    w += course.credits
                }
                if (course.student_course.completed) {
                    c += course.credits
                }
                if (course.student_course.improved) {
                    i += course.credits
                }
                if (course.student_course.repeated) {
                    r += course.credits
                }
            }
        }

        setRepeated(r);
        setWorking(w);
        setImproved(i);
        setCompleted(c);
    }, [semes, courses])


    let data = [
        {
            type: 'Đã hoàn thành',
            value: completed,
        },
        {
            type: 'Học cải thiện',
            value: improved,
        },
        {
            type: 'Học lại',
            value: repeated,
        },
        {
            type: 'Đang học',
            value: working,
        },
    ];
    var config = {
        appendPadding: 10,
        data: data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            autoRotate: false,
            style: {
                textAlign: 'center',
                fontSize: 14,
                fill: '#303030'
            },
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };
    return (
        <>
            <Pie {...config} />
        </>
    )
}

export default CreditStatistic;
