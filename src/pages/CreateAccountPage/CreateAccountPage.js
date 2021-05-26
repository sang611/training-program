import {Redirect} from "react-router-dom";
import {Col, Row, Tabs} from "antd";
import {useSelector} from "react-redux";
import React from "react";
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
