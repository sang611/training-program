import {useEffect, useState} from "react";
import axios from "axios";
import {Line} from "@ant-design/charts";
import {Card, Spin} from "antd";

const ActivityChart = () => {

    const [infors, setInfors] = useState(null);

    useEffect(() => {
        axios.get("/accounts/activity/information")
            .then(res => {
                setInfors(res.data.infors.map(infor => {
                    infor.role = infor.role == 1 || infor.role == 2 ? "Giảng viên" : "Sinh viên"
                    return infor;
                }))
            })
            .catch((e) => {
                setInfors([])
            })


    }, [])

    let config = {
        data: infors,
        xField: 'date',
        yField: 'login_total',
        seriesField: 'role',
        color: ['#1979C9', '#D62A0D'],
    };
    return infors ? (
        <>
            <Card>
                <Line {...config} />
            </Card>
        </>
    ) : <Spin />

        ;
}
export default ActivityChart

