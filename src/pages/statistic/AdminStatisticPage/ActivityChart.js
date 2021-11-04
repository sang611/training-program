import {useEffect, useState} from "react";
import axios from "axios";
import {Line} from "@ant-design/charts";
import {Card, Skeleton, Spin, Tag} from "antd";
import Title from "antd/lib/typography/Title";

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
        smooth: false
    };
    return infors ? (
        <>
            <Card title={
                "Biểu đồ mức độ hoạt động của người dùng"
            }>
                <Line {...config} />
            </Card>
        </>
    ) : <Skeleton active/>


}
export default ActivityChart

