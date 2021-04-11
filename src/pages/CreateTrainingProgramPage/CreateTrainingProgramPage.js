import {useEffect, useState, useRef} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, DatePicker, Form, Input, InputNumber, message, Radio, Row, Select, Space} from "antd";
import moment from "moment";
import {MailTwoTone, PhoneTwoTone} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../redux/actions";
import {Option} from "antd/lib/mentions";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import JoditEditor from "jodit-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {useHistory, useParams} from "react-router-dom";

const CreateTrainingProgramPage = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const history = useHistory();
    const insState = useSelector(state => state.institutions)
    const {majors} = useSelector(state => state.majors);

    const [commonDestination, setCommonDestination] = useState("");
    const [specificDestination, setSpecificDestination] = useState("");

    useEffect(() => {
        dispatch(actions.getAllInstitution());
        dispatch(actions.getAllMajor());
    }, [])


    async function onCreateTrainingProgram(values) {
        try {
            values.common_destination = commonDestination;
            values.specific_destination = specificDestination;
            const response = await axios.post("/training-programs", values)
            console.log(response.status)
            if (response.status === 201) {
                message.success("Tạo mới Chương trình đào tạo thành công")
                history.push("/uet/training-programs")
            }
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }

    }

    return (
        <>
            <Form
                layout="vertical"
                form={form}
                onFinish={onCreateTrainingProgram}
            >
                <Title level={3}>1. Thông tin chương trình đào tạo</Title>
                <Row>
                    <Col span={20} offset={1}>
                        {/*<Row>
                            <Col span={10}>
                                <Form.Item label="Ngành đào tạo:" name="major">
                                    <Select placeholder="Ngành đào tạo của chương trình">
                                        {
                                            majors.map((major, index) => {
                                                return <Select.Option value={major.uuid} key={index}>{
                                                    major.vn_name
                                                }</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>*/}
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
                                    <InputNumber min={1} max={10} defaultValue={1} stringMode/>
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
                        {/*<Form.Item label="Đơn vị chuyên môn:" name="institution">
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Đơn vị chuyên môn"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    insState.listInstitutions.map((ins, index) =>
                                        <Select.Option value={ins.uuid} key={index}>{ins.vn_name}</Select.Option>
                                    )
                                }

                            </Select>
                        </Form.Item>*/}

                        <br/>
                    </Col>
                </Row>
                <Title level={3}>2. Mục tiêu đào tạo</Title>
                <Row>
                    <Col span={20} offset={1}>


                            {/*<Form.Item label="Mục tiêu chung" name="common_destination">
                                <TextArea value={commonDestination} style={{display: 'none'}} rows={0}/>
                            </Form.Item>*/}
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    placeholder: "Nội dung mục tiêu đào tạo chung",
                                }}

                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setCommonDestination(data)
                                }}
                            />
                        <br/><br/>
                           {/* <Form.Item label="Mục tiêu cụ thể" name="specific_destination">

                                <TextArea value={specificDestination} style={{display: 'none'}}/>

                            </Form.Item>*/}
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    placeholder: "Nội dung mục tiêu đào tạo cụ thể",
                                }}

                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setSpecificDestination(data)
                                }}
                            />



                    </Col>
                </Row>
                <Title level={3}>3. Thông tin tuyển sinh</Title>
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
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CreateTrainingProgramPage;