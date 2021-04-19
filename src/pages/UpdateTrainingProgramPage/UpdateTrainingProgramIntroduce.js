import Title from "antd/lib/typography/Title";
import {Button, Col, Form, Input, InputNumber, message, Row, Select} from "antd";
import Text from "antd/lib/typography/Text";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const UpdateTrainingProgramIntroduce = () => {
    let {uuid} = useParams();
    const [form] = Form.useForm();
    const {trainingProgram} = useSelector(state => state.trainingPrograms)
    const [commonDestination, setCommonDestination] = useState("");
    const [specificDestination, setSpecificDestination] = useState("");
    const insState = useSelector(state => state.institutions)

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
                institution: institution ? institution.uuid : ''
            })

            setCommonDestination(common_destination);
            setSpecificDestination(specific_destination);
        }
    }, [trainingProgram])

    async function onUpdateTrainingProgram(values) {
        try {
            values.common_destination = commonDestination;
            values.specific_destination = specificDestination;

            console.log(values);

            const response = await axios.put(`/training-programs/${uuid}`, values)
            console.log(response.status)
            message.success("Cập nhật thông tin thành công");

        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }
    return (
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
                        <Text>Mục tiêu chung</Text>
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                placeholder: "Nội dung mục tiêu đào tạo chung",
                            }}
                            data={trainingProgram.common_destination}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log(data)
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
        </>
    )
}

export default UpdateTrainingProgramIntroduce;