import {useDispatch} from "react-redux";
import {Button, Form, Input, message, Select, Space} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as actions from "../../redux/actions";
import {Option} from "antd/lib/mentions";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const CreateCLO = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [locs, setLocs] = useState([]);
    const [plos, setPlos] = useState([]);
    useEffect(() => {
        axios.get("/learning-outcomes/1")
            .then((res) => setLocs(res.data.learningOutcomes))
    }, [])

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: {span: 24, offset: 0},
            sm: {span: 20, offset: 0},
        },
    };
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 20},
        },
    };

    const onFinish = (values) => {
        const data = {
            locs: values.locs,
            category: 2,
            plos: plos
        }
        axios.post("/learning-outcomes", data)
            .then((res) => {
                message.success("CĐR được thêm thành công")
                dispatch(actions.getAllLearningOutcomes({typeLoc: 2}))
            })
            .catch((e) => message.error("Đã có lỗi xảy ra"))
        form.resetFields();
    };

    function handleChange(value) {
        setPlos(value);
    }

    return (
        <>
            <Select
                mode="multiple"
                allowClear
                size={"middle"}
                style={{width: '100%'}}
                placeholder="Chọn các CĐR CTĐT có liên quan"
                onChange={handleChange}
            >
                {
                    locs.map((loc) => {
                        return (
                            <Option key={loc.uuid}>{loc.content}</Option>
                        )
                    })
                }

            </Select><br/><br/>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.List
                    name="locs"
                    rules={[{required: true, message: 'Tạo ít nhất 1 nội dung CĐR'}]}
                >
                    {(fields, { add, remove }, {errors}) => (
                        <>
                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} align="start">
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'content']}
                                        fieldKey={[fieldKey, 'content']}
                                        rules={[{ required: true, message: 'Nhập nội dung chuẩn đầu ra' }]}
                                    >
                                        <Input.TextArea placeholder="Mô tả" cols={100}/>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'title']}
                                        fieldKey={[fieldKey, 'title']}
                                        rules={[{ required: true, message: '' }]}
                                    >
                                        <Select placeholder="Nhóm">
                                            <Select.Option key={1} value={1}>Kiến thức</Select.Option>
                                            <Select.Option key={2} value={2}>Kỹ năng</Select.Option>
                                            <Select.Option key={3} value={3}>Đạo đức</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
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
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CreateCLO;
