import axios from "axios";
import {useHistory, useParams} from "react-router";
import React, {useEffect, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Divider, Form, Input, InputNumber, message, Row, Select, Spin, Tabs} from "antd";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import AddTrainingProgramLOC from "./AddTrainingProgramLOC";
import AddTrainingProgramFrame from "./AddTrainingProgramFrame";
import AddCourseDocument from "./AddCourseDocument";
import AddTrainingSequence from "./AddTrainingSequence";
import AddTrainingProgramClass from "./AddTrainingProgramClass";
import SummaryContentTraining from "./SummaryContentTraining";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import Text from "antd/lib/typography/Text";
import UpdateTrainingProgramIntroduce from "./UpdateTrainingProgramIntroduce";

const UpdateTrainingProgramPage = (props) => {
    const dispatch = useDispatch();
    let {uuid} = useParams();
    const {trainingProgram} = useSelector(state => state.trainingPrograms)



    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
        dispatch(actions.getAllInstitution());
    }, [])






       return trainingProgram ?  (
            <>
                <Tabs defaultActiveKey="1" tabPosition="right">
                    <Tabs.TabPane tab="Giới thiệu chung" key="1" forceRender={true}>
                        <UpdateTrainingProgramIntroduce />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Chuẩn đầu ra" key="2" forceRender={true}>
                        <AddTrainingProgramLOC trainingProgram={trainingProgram}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Nội dung" key="3" forceRender={true}>
                        <SummaryContentTraining trainingProgram={trainingProgram}/><br/><br/>
                        <AddTrainingProgramFrame trainingProgram={trainingProgram}/><br/><br/>

                        <AddCourseDocument trainingProgram={trainingProgram} type={"doc"}/><br/><br/>
                        <AddCourseDocument trainingProgram={trainingProgram} type={"lec"}/><br/><br/>

                        <AddTrainingSequence trainingProgram={trainingProgram} /><br/><br/>

                        <AddTrainingProgramClass trainingProgram={trainingProgram} /><br/><br/>
                    </Tabs.TabPane>
                </Tabs>

            </>
        ) : <Spin />



}

export default UpdateTrainingProgramPage;
