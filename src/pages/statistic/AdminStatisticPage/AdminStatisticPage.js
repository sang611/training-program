
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../../redux/actions'
import {Card, Col, Row, Tag} from "antd";
import Title from "antd/lib/typography/Title";
import './AdminStatisticPage.css'
import TrainingProgramStatistic from "./TrainingProgramStatistic";
import CourseStatistic from "./CourseStatistic";
import UserStatistic from "./UserStatistic";
import axios from "axios";
import ActivityChart from "./ActivityChart";


function AdminStatisticPage() {

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(actions.fetchAccounts({typeAccount: 'GV'}))
        dispatch(actions.fetchAccounts({typeAccount: 'SV'}))


    }, [])

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} xl={{span: 12}}>
                    <TrainingProgramStatistic/>
                </Col>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 24}} xl={{span: 12}}>
                    <Row gutter={[20, 20]}>
                        <Col xs={{span: 24}} sm={{span: 12}} md={{span: 12}} xl={{span: 12}}>
                            <CourseStatistic/>
                        </Col>
                        <Col xs={{span: 24}} sm={{span: 12}} md={{span: 12}} xl={{span: 12}}>
                            <UserStatistic/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={24}>
                            <ActivityChart />
                        </Col>

                    </Row>
                </Col>


            </Row>

        </>
    )
}



export default AdminStatisticPage

