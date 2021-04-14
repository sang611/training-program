import axios from "axios";
import {useHistory, useParams} from "react-router";
import React, {useEffect, useMemo, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Divider, Form, Input, InputNumber, message, Row, Select, Space, Spin} from "antd";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import AddTrainingProgramLOC from "./AddTrainingProgramLOC";
import AddTrainingProgramFrame from "./AddTrainingProgramFrame";
import AddCourseDocument from "./AddCourseDocument";
import AddTrainingSequence from "./AddTrainingSequence";
import AddTrainingProgramClass from "./AddTrainingProgramClass";
import SummaryContentTraining from "./SummaryContentTraining";
import SummaryContentCourse from "../DetailTrainingProgramPage/SummaryContentCourse";
import DependencyCourseGraph from "./DependencyCourseGraph";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import Text from "antd/lib/typography/Text";

const UpdateTrainingProgramPage = (props) => {
    let {uuid} = useParams();
    let history = useHistory();
    const [form] = Form.useForm();
    //const [trainingProgram, setTrainingProgram] = useState({})
    const dispatch = useDispatch();
    const insState = useSelector(state => state.institutions)
    const {trainingProgram, loadingATraining, errorLoadA} = useSelector(state => state.trainingPrograms)

    const [loading, setLoading] = useState(true);

    const [commonDestination, setCommonDestination] = useState("");
    const [specificDestination, setSpecificDestination] = useState("");

    useEffect(() => {

        /*axios.get(`/training-programs/${uuid}`)
            .then((res) => {
                setTrainingProgram(res.data.trainingProgram)
                const {
                    vn_name,
                    en_name,
                    training_program_code,
                    graduation_title,
                    training_duration,
                    graduation_diploma_vi,
                    graduation_diploma_en,
                    institution,
                    common_destination,
                    specific_destination,
                    admission_method,
                    admission_scale
                } = res.data.trainingProgram;

                form.setFieldsValue({
                    vn_name,
                    en_name,
                    training_program_code,
                    graduation_title,
                    training_duration,
                    graduation_diploma_vi,
                    graduation_diploma_en,
                    common_destination,
                    specific_destination,
                    admission_method,
                    admission_scale
                })

            })
            .catch((e) => {
            })
            .finally(() => setLoading(false))*/

        dispatch(actions.getATrainingProgram({id: uuid}));
        dispatch(actions.getAllInstitution());
    }, [])

    useEffect(() => {
        if(trainingProgram) {
            const {
                vn_name,
                en_name,
                training_program_code,
                graduation_title,
                training_duration,
                graduation_diploma_vi,
                graduation_diploma_en,
                common_destination,
                specific_destination,
                admission_method,
                admission_scale,
                institution
            } = trainingProgram;

            form.setFieldsValue({
                vn_name,
                en_name,
                training_program_code,
                graduation_title,
                training_duration,
                graduation_diploma_vi,
                graduation_diploma_en,
                common_destination,
                specific_destination,
                admission_method,
                admission_scale,
                institution: institution.uuid
            })
        }
        console.log("re render")
    }, [trainingProgram])

    async function onUpdateTrainingProgram(values) {
        try {
            values.common_destination = commonDestination;
            values.specific_destination = specificDestination;
            const response = await axios.put(`/training-programs/${uuid}`, values)
            console.log(response.status)
            message.success("Cập nhật thông tin thành công");

            /*setTimeout(() => {
                history.push(`/uet/training-programs/${uuid}`);
            }, 3000)*/

        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }



    return useMemo(() => {
        console.log("rerender memo")
       return trainingProgram ?  (
            <>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onUpdateTrainingProgram}
                >
                    <Title level={3}>
                        PHẦN I: GIỚI THIỆU CHUNG VỀ CHƯƠNG TRÌNH ĐÀO TẠO
                    </Title>
                    <Title level={4}>1. Thông tin chương trình đào tạo</Title>
                    <Row>
                        <Col span={15} offset={1}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label="Tên ngành đào tạo (VN):" name="vn_name">
                                        <Input placeholder="Tên chương trình bằng Tiếng Việt"
                                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Tên ngành đào tạo (EN):" name="en_name">
                                        <Input placeholder="Tên chương trình bằng Tiếng Anh"
                                               addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <Form.Item label="Mã ngành đào tạo:" name="training_program_code">
                                        <Input placeholder="Nhập mã ngành đào tạo"
                                               addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                    <Form.Item label="Danh hiệu tốt nghiệp:" name="graduation_title">
                                        <Input placeholder="Danh hiệu tốt nghiệp của CTĐT"
                                               addonBefore={<i className="fas fa-user-graduate"
                                                               style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>

                                    <Form.Item label="Thời gian đào tạo:" name="training_duration">
                                        {
                                            <InputNumber min={1} max={10} />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item label="Tên văn bằng tốt nghiệp (VN):" name="graduation_diploma_vi">
                                        <Input placeholder="Tên văn bằng tốt nghiệp bằng Tiếng Việt"
                                               addonBefore={<i className="fas fa-file-signature"
                                                               style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Tên văn bằng tốt nghiệp (EN):" name="graduation_diploma_en">
                                        <Input placeholder="Tên văn bằng tốt nghiệp bằng Tiếng Anh"
                                               addonBefore={<i className="fas fa-file-signature"
                                                               style={{color: '#1890FF'}}/>}/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Đơn vị chuyên môn:" name="institution">
                                <Select
                                    showSearch
                                    style={{width: '50%'}}
                                    placeholder="Đơn vị chuyên môn"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        insState.listInstitutions
                                            .filter(ins => !ins.parent_uuid)
                                            .map((ins, index) =>
                                                <Select.Option value={ins.uuid} key={index}>{ins.vn_name}</Select.Option>
                                            )
                                    }

                                </Select>
                        </Form.Item>


                        </Col>
                    </Row>
                    <br/>
                    <Title level={4}>2. Mục tiêu đào tạo</Title>
                    <Row>
                        <Col span={20} offset={1}>

                            {/*<Space direction="vertical" style={{width: '100%'}}>
                            <Form.Item label="Mục tiêu chung" name="common_destination">
                                <JoditEditor
                                    tabIndex={1}
                                    value={""}/>
                                    <Input.TextArea rows={5}/>

                            </Form.Item>
                            <Form.Item label="Mục tiêu cụ thể" name="specific_destination">
                                <Input.TextArea rows={5}/>
                            </Form.Item>
                        </Space>*/}
                            <Text>Mục tiêu chung</Text>
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    placeholder: "Nội dung mục tiêu đào tạo chung",
                                }}
                                data={trainingProgram.common_destination}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setCommonDestination(data)
                                }}
                            />
                            <br/><br/>
                            <Text>Mục tiêu cụ thể</Text>
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    placeholder: "Nội dung mục tiêu đào tạo cụ thể",
                                }}
                                data={trainingProgram.specific_destination}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setSpecificDestination(data)
                                }}
                            />

                        </Col>
                    </Row>
                    <Title level={4}>3. Thông tin tuyển sinh</Title>
                    <Row>
                        <Col span={12} offset={1}>

                            <Form.Item label="Hình thức tuyển sinh" name="admission_method">
                                <Input placeholder="Hình thức tuyển sinh của CTĐT"
                                       addonBefore={<i className="fas fa-file-signature" style={{color: '#1890FF'}}/>}/>
                            </Form.Item>
                            <Form.Item label="Quy mô tuyển sinh dự kiến" name="admission_scale">
                                <Input placeholder="Quy mô dự kiến"
                                       addonBefore={<i className="fas fa-file-signature" style={{color: '#1890FF'}}/>}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                    </Form.Item>
                </Form>
                <Divider />

                <Title level={3}>
                    Phần II. Chuẩn đầu ra của CTĐT
                </Title>
                <AddTrainingProgramLOC trainingProgram={trainingProgram}/>

                <Divider />
                <Title level={3}>
                    PHẦN III: NỘI DUNG CHƯƠNG TRÌNH ĐÀO TẠO
                </Title>
                <SummaryContentTraining trainingProgram={trainingProgram}/><br/><br/>
                <AddTrainingProgramFrame trainingProgram={trainingProgram}/><br/><br/>

                <AddCourseDocument trainingProgram={trainingProgram} type={"doc"}/><br/><br/>
                <AddCourseDocument trainingProgram={trainingProgram} type={"lec"}/><br/><br/>

                <DependencyCourseGraph trainingProgram={trainingProgram} /><br/><br/>
                <AddTrainingSequence trainingProgram={trainingProgram} /><br/><br/>

                <AddTrainingProgramClass trainingProgram={trainingProgram} /><br/><br/>

            </>
        ) : <Spin />
    }, [trainingProgram, insState])


}

export default UpdateTrainingProgramPage;
