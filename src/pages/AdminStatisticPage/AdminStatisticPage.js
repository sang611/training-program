
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions'
import {Card, Col, Row, Tag} from "antd";
import Title from "antd/lib/typography/Title";
import './AdminStatisticPage.css'
import TrainingProgramStatistic from "./TrainingProgramStatistic";
import CourseStatistic from "./CourseStatistic";
import UserStatistic from "./UserStatistic";


function AdminStatisticPage() {

    const dispatch = useDispatch();

    const {accounts} = useSelector((state) => state.accounts);

    useEffect(() => {

        dispatch(actions.fetchAccounts({typeAccount: 'GV'}))
        dispatch(actions.fetchAccounts({typeAccount: 'SV'}))
    }, [])

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={12}>
                    <TrainingProgramStatistic/>
                </Col>
                <Col span={12}>
                    <Row gutter={[20, 20]}>
                        <Col span={12}>
                            <CourseStatistic/>
                        </Col>
                        <Col span={12}>
                            <UserStatistic/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        ABC
                    </Row>
                </Col>


            </Row>

        </>
    )
}



export default AdminStatisticPage
