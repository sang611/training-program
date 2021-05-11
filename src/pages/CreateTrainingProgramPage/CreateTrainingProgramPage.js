import {useEffect, useState} from 'react';
import Title from "antd/lib/typography/Title";
import {Button, Col, Form, Input, InputNumber, message, Row, Select, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {useHistory} from "react-router-dom";
import {trainingTypes} from "../../constants";

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

    /*function handleIns(listInstitution) {
        listInstitution.forEach((ins => {
            ins.label = ins.vn_name;
            ins.value = ins.uuid;
            if(ins.children)
            handleIns(ins.children);
        }))
    }

    useEffect(() => {
        handleIns(insState.listInstitutions)
    }, [insState.listInstitutions])
*/


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
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label="Tên ngành đào tạo (VN):"
                                    name="vn_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên ngành đào tạo của chương trình'
                                        },
                                    ]}
                                >
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
                                <Form.Item
                                    label="Mã ngành đào tạo:"
                                    name="training_program_code"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập mã ngành đào tạo của chương trình'
                                        },
                                    ]}
                                >
                                    <Input placeholder="Nhập mã ngành đào tạo"
                                           addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                                </Form.Item>
                                <Form.Item
                                    label="Danh hiệu tốt nghiệp:"
                                    name="graduation_title"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Danh hiệu tốt nghiệp không được để trống'
                                        },
                                    ]}
                                >
                                    <Input placeholder="Danh hiệu tốt nghiệp của CTĐT"
                                           addonBefore={<i className="fas fa-user-graduate"
                                                           style={{color: '#1890FF'}}/>}/>
                                </Form.Item>
                                <Space size="large">
                                    <Form.Item label="Thời gian đào tạo:" name="training_duration">
                                        <InputNumber min={1} max={10} defaultValue={1} stringMode/>
                                    </Form.Item>
                                    <Form.Item label="Năm áp dụng:" name="version">
                                        <InputNumber min={2000} max={3000} defaultValue={2021} stringMode/>
                                    </Form.Item>
                                </Space>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label="Tên văn bằng tốt nghiệp (VN):"
                                    name="graduation_diploma_vi"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập tên văn bằng tốt nghiệp của chương trình'
                                        },
                                    ]}
                                >
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
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label="Đơn vị chuyên môn phụ trách:"
                                    name="institutionUuid"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn đơn vị phụ trách chương trình'
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{width: '100%'}}
                                        placeholder="Đơn vị chuyên môn phụ trách"
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

                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label="Loại chương trình đào tạo:"
                                    name="type"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn loại chương trình đào tạo'
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{width: '100%'}}
                                        placeholder="Loại chương trình đào tạo"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            trainingTypes
                                                .map((type, index) =>
                                                    <Select.Option value={type} key={index}>{type}</Select.Option>
                                                )
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>


                        <br/>
                    </Col>
                </Row>
                <Title level={3}>2. Mục tiêu đào tạo</Title>
                <Row>
                    <Col span={20} offset={1}>

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
                <br/>
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
