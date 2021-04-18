import {Redirect} from "react-router-dom";
import {Button, Cascader, Col, DatePicker, Form, Input, message, Radio, Row, Select, Tabs} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import {AndroidOutlined, AppleOutlined, InboxOutlined, MailFilled, MailTwoTone, PhoneTwoTone} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import * as actions from '../../redux/actions'
import {Option} from "antd/lib/mentions";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import axios from "axios";
import moment from 'moment';
import AddingLecturerForm from "./AddingLecturerForm";
import AddingStudentForm from "./AddingStudentForm";


const CreateAccountPage = () => {
    const {isValidToken} = useSelector(state => state.auth)


    return !isValidToken ? <Redirect to="/uet/signin"/> : (
        <>
            <Row>
                <Col span={24}>
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane
                            tab={
                                <span>
                                  <i className="fas fa-chalkboard-teacher"/>&ensp;
                                  Giảng viên
                                </span>
                            }
                            key={1}
                        >{<AddingLecturerForm />}
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span>
                                  <i className="fas fa-user-graduate"/>&ensp;
                                  Sinh viên
                                </span>
                            }
                            key={2}
                        >{<AddingStudentForm />}
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>

        </>


    )
};

export default CreateAccountPage;
