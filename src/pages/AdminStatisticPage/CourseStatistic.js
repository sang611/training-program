import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import Title from "antd/lib/typography/Title";
import {Card, Col, Row} from "antd";
import {ApartmentOutlined, BookOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";

function CourseStatistic() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {courses} = useSelector(state => state.courses)
    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])

    return (
        <>
            <Card bodyStyle={{backgroundColor: '#F6FFED'}}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card
                            bodyStyle={{backgroundColor: '#FF9600'}}
                            className="statistic-info"
                            hoverable
                        >
                            <center>
                                <Title level={1}>
                                    {
                                        courses.reduce((a, b) => a + b.outlines.length, 0)
                                    }&nbsp;
                                    <ApartmentOutlined />
                                </Title>
                                <Title level={3}>ĐỀ CƯƠNG</Title>
                            </center>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card
                            bodyStyle={{backgroundColor: '#00A65A'}}
                            className="statistic-info"
                            hoverable
                            onClick={() => history.push("/uet/courses")}
                        >
                            <center>
                                <Title level={1}>
                                    {
                                        courses.length
                                    }&nbsp;
                                    <BookOutlined />
                                </Title>
                                <Title level={3}>HỌC PHẦN</Title>
                            </center>
                        </Card>
                    </Col>
                </Row>


            </Card>

        </>
    )
}

export default CourseStatistic
