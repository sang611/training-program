import axios from "axios";
import {Button, Col, Form, Input, message, Row, Select, Space} from "antd";
import * as actions from "../../redux/actions";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";
import {useDispatch} from "react-redux";
import {locTypes} from "../../constants";

const CreatePLO = ({onCloseDrawer, setContent, setTitle}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const onFinish = (values) => {
        const data = {
            locs: values.locs,
            category: 1,
        }

        axios.post("/learning-outcomes", data)
            .then((res) => {
                message.success("CĐR được thêm thành công")
                dispatch(actions.getAllLearningOutcomes({typeLoc: 1}))
                if(onCloseDrawer) onCloseDrawer();
                if(setContent) setContent("");
                if(setTitle) setTitle(0)
            })
            .catch((e) => message.error("Đã có lỗi xảy ra"))
        form.resetFields();
    };
    return (
        <>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">

                <Form.List
                    name="locs"
                    rules={[{required: true, message: 'Tạo ít nhất 1 nội dung CĐR'}]}
                >
                    {(fields, { add, remove }, {errors}) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Row>
                                    <Col span={19}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'content']}
                                            fieldKey={[fieldKey, 'content']}
                                            rules={[{ required: true, message: 'Nhập nội dung chuẩn đầu ra' }]}
                                        >
                                            <Input.TextArea
                                                placeholder="Mô tả"
                                                cols={90}
                                                autoSize
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'title']}
                                            fieldKey={[fieldKey, 'title']}
                                            rules={[{ required: true, message: '' }]}
                                        >
                                            <Select placeholder="Nhóm">
                                                {
                                                    locTypes.map(type => <Select.Option key={type.value} value={type.value}>{type.content}</Select.Option>)
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        <center>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </center>

                                    </Col>

                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    block
                                    onClick={() => add()}
                                    icon={<PlusOutlined/>}
                                >
                                    Thêm CĐR
                                </Button>
                            </Form.Item>
                            <Form.ErrorList errors={errors}/>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CreatePLO;
