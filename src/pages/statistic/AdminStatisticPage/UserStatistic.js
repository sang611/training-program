import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions";
import Title from "antd/lib/typography/Title";
import {Card, Col, Row, Skeleton} from "antd";
import {useHistory} from "react-router-dom";

function CourseStatistic() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {accounts, totalAccounts, loadingAll} = useSelector((state) => state.accounts);

    const [totalLec, setTotalLec] = useState(0);
    const [totalStu, setTotalStu] = useState(0);

    useEffect(() => {
        dispatch(actions.fetchAccounts({typeAccount: 'GV'}))
        dispatch(actions.fetchAccounts({typeAccount: 'SV'}))
    }, [])

    useEffect(() => {
        if(accounts.length > 0) {
            if(accounts[0].account.role === 3) {
                setTotalStu(
                    totalAccounts
                )
            }
            else {
                setTotalLec(
                    totalAccounts
                )
            }
        }
    }, [accounts])

    if(loadingAll) return <Skeleton active/>

    return (
        <>
            <Card bodyStyle={{backgroundColor: '#FFF1F0'}}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card
                            bodyStyle={{backgroundColor: '#F56954'}}
                            className="statistic-info"
                            hoverable
                            onClick={() => history.push("/uet/users")}
                        >
                            <center>
                                <Title level={1}>
                                    {
                                        totalLec
                                    }&nbsp;
                                    <i className="fas fa-chalkboard-teacher"></i>
                                </Title>
                                <Title level={3}>GIẢNG VIÊN</Title>
                            </center>
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card
                            bodyStyle={{backgroundColor: '#E95258'}}
                            className="statistic-info"
                            hoverable
                            onClick={() => history.push("/uet/users/?type=SV")}
                        >
                            <center>
                                <Title level={1}>
                                    {
                                        totalStu
                                    }&nbsp;
                                    <i className="fas fa-user-graduate"></i>
                                </Title>
                                <Title level={3}>SINH VIÊN</Title>
                            </center>
                        </Card>
                    </Col>
                </Row>


            </Card>

        </>
    )
}

export default CourseStatistic
