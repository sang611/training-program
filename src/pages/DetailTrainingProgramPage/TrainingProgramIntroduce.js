import Title from "antd/lib/typography/Title";
import {Button, Col, Descriptions, Row, Spin} from "antd";
import Parser from "html-react-parser";
import DependencyCourseGraph from "./DependencyCourseGraph";
import SummaryContentCourse from "./SummaryContentCourse";
import {FilePdfOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import {useParams} from "react-router-dom";
const DescriptionItem = ({title, content}) => (
    <>
        <div style={{display: 'inline-flex'}}>
            <b>
                <p>{title}:</p>
            </b>

            &nbsp;
            {content}

        </div>
        <br/>
    </>
);
const TrainingProgramIntroduce = () => {
    const {uuid} = useParams();
    const dispatch = useDispatch();
    const {trainingProgram, loadingATraining, errorLoadA} = useSelector(state => state.trainingPrograms)

    useEffect(() => {
        dispatch(actions.getATrainingProgram({id: uuid}));
    }, [])

    if (trainingProgram) {
        const {
            vn_name,
            en_name,
            training_program_code,
            graduation_title,
            training_duration,
            graduation_diploma_en,
            graduation_diploma_vi,
            admission_method,
            admission_scale,
            common_destination,
            specific_destination,
            learning_outcomes,
            courses,
            institution
        } = trainingProgram
        return (
            <>
                <Title level={3}>
                    PHẦN I: GIỚI THIỆU CHUNG VỀ CHƯƠNG TRÌNH ĐÀO TẠO
                </Title>
                <Title level={4}>
                    1. Một số thông tin về chương trình đào tạo
                </Title>
                <Row>
                    <Col offset={1} span={23}>
                        <Descriptions column={1} labelStyle={{fontWeight: 'bold'}}>
                            <Descriptions.Item label="Tên ngành đào tạo (VI)" content={vn_name}>{vn_name}</Descriptions.Item>
                            <Descriptions.Item label="Tên ngành đào tạo (EN)" content={en_name}>{en_name}</Descriptions.Item>
                            <Descriptions.Item label="Mã ngành đào tạo" content={training_program_code}>{training_program_code}</Descriptions.Item>
                            <Descriptions.Item label="Danh hiệu tốt nghiệp" content={graduation_title}>{graduation_title}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian đào tạo" content={training_duration + " năm"}>{training_duration + " năm"}</Descriptions.Item>
                            <Descriptions.Item label="Tên văn bằng tốt nghiệp (VI)" content={graduation_diploma_vi}>{graduation_diploma_vi}</Descriptions.Item>
                            <Descriptions.Item label="Tên văn bằng tốt nghiệp (EN)" content={graduation_diploma_en}>{graduation_diploma_en}</Descriptions.Item>
                            <Descriptions.Item label="Đơn vị được giao nhiệm vụ đào tạo" content={
                                institution ? `${institution.vn_name}, Trường Đại học Công nghệ, ĐHQGHN` : ''
                            }>
                                {
                                    institution ? `${institution.vn_name}, Trường Đại học Công nghệ, ĐHQGHN` : ''
                                }
                            </Descriptions.Item>
                        </Descriptions>

                    </Col>
                </Row>

                <Title level={4}>
                    2. Mục tiêu của chương trình đào tạo
                </Title>
                <Title level={5}>
                    2.1. Mục tiêu chung
                </Title>
                <Row>
                    <Col offset={1} span={20}>
                        <div id="common_destination">
                            {
                                common_destination ? Parser(common_destination) : ''
                            }
                        </div>
                    </Col>
                </Row><br/>
                <Title level={5}>
                    2.2. Mục tiêu cụ thể
                </Title>
                <Row>
                    <Col offset={1} span={20}>
                        <div id={"specific_destination"}>
                            {
                                specific_destination ? Parser(specific_destination) : ''
                            }
                        </div>
                    </Col>
                </Row>
                <br/>
                <Title level={4}>
                    3. Thông tin tuyển sinh
                </Title>
                <Col offset={1} span={20}>
                    <DescriptionItem title="Hình thức tuyển sinh" content={admission_method}/>
                    <DescriptionItem title="Dự kiến quy mô tuyển sinh" content={admission_scale}/>
                </Col>
            </>
        )
    }
    else {
        return <Spin />;
    }
}

export default TrainingProgramIntroduce;
