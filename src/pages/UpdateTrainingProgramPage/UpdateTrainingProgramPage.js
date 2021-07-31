import {useParams} from "react-router";
import React, {useEffect} from 'react';
import {Spin, Tabs} from "antd";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import AddTrainingProgramLOC from "./AddTrainingProgramLOC";
import AddTrainingProgramFrame from "./AddTrainingProgramFrame";
import AddCourseDocument from "./AddCourseDocument";
import AddTrainingSequence from "./AddTrainingSequence";
import AddTrainingProgramClass from "./AddTrainingProgramClass";
import SummaryContentTraining from "./SummaryContentTraining";
import UpdateTrainingProgramIntroduce from "./UpdateTrainingProgramIntroduce";
import {SlackOutlined} from "@ant-design/icons";

const UpdateTrainingProgramPage = (props) => {
    const dispatch = useDispatch();
    let {uuid} = useParams();
    const {trainingProgram, loadingATraining} = useSelector(state => state.trainingPrograms)



    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
        dispatch(actions.getAllInstitution());
    }, [])

    if(loadingATraining) return <>
        <center>
            <Spin
                indicator={
                    <SlackOutlined
                        style={{fontSize: '60px', marginTop: '200px'}}
                        spin
                    />
                }
                size="large"
            />
        </center>
    </>

       return trainingProgram ?  (
            <>
                <Tabs
                    type="card"
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
