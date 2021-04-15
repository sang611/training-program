import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import Title from "antd/lib/typography/Title";
import {Card, Col, Row} from "antd";

function CourseStatistic() {
    const dispatch = useDispatch();
    const {accounts} = useSelector((state) => state.accounts);

    const [totalLec, setTotalLec] = useState(0);
    const [totalStu, setTotalStu] = useState(0);

    useEffect(() => {

        dispatch(actions.fetchAccounts({typeAccount: 'GV'}))
        dispatch(actions.fetchAccounts({typeAccount: 'SV'}))
    }, [])

    useEffect(() => {
        if(accounts.length > 0) {
            if(accounts[0].account.role == 3) {
                setTotalStu(
                    accounts
                        .filter(({account}) => account.role == 3)
                        .length
                )
            }
            else {
                setTotalLec(
                    accounts
                        .filter(({account}) => account.role == 1 || account.role == 2)
                        .length
                )
            }
        }
    }, [accounts])

    return (
        <>
            <Card bodyStyle={{backgroundColor: '#F9F0FF'}}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card bodyStyle={{backgroundColor: '#F56954'}} className="statistic-info">
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
                        <Card bodyStyle={{backgroundColor: '#E95258'}} className="statistic-info">
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
