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
import {Skeleton} from "antd/es";

const UpdateTrainingProgramPage = (props) => {
    const dispatch = useDispatch();
    let {uuid} = useParams();
    const {trainingProgram, loadingATraining} = useSelector(state => state.trainingPrograms)



    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
        dispatch(actions.getAllInstitution());
    }, [])

    if(loadingATraining) return <>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
    </>

       return trainingProgram ?  (
            <>
                <Tabs
                    defaultActiveKey={localStorage.getItem('activeKeyTabTrainingCourse')}
                    tabPosition="top"
                    onChange={(key) => localStorage.setItem('activeKeyTabTrainingCourse', key) }
                >
                    <Tabs.TabPane tab="Giới thiệu chung" key={1} forceRender={true}>
                        <UpdateTrainingProgramIntroduce />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Chuẩn đầu ra" key={2} forceRender={true}>
                        <AddTrainingProgramLOC trainingProgram={trainingProgram}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Khung chương trình" key={3}>
                        <SummaryContentTraining trainingProgram={trainingProgram}/><br/><br/>
                        <AddTrainingProgramFrame trainingProgram={trainingProgram}/><br/><br/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Danh mục tài liệu" key={4}>
                        <AddCourseDocument trainingProgram={trainingProgram} type={"doc"}/><br/><br/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Đội ngũ cán bộ" key={5}>
                        <AddCourseDocument trainingProgram={trainingProgram} type={"lec"}/><br/><br/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Trình tự đào tạo" key={6}>
                        <AddTrainingSequence trainingProgram={trainingProgram} /><br/><br/>
                        <AddTrainingProgramClass trainingProgram={trainingProgram} /><br/><br/>
                    </Tabs.TabPane>
                </Tabs>

            </>
        ) : <Spin />

}

export default UpdateTrainingProgramPage;
