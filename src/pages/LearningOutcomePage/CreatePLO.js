import axios from "axios";
import {Button, Form, Input, message, Select, Space} from "antd";
import * as actions from "../../redux/actions";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";
import {useDispatch} from "react-redux";

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
                                            <Select.Option key={3} value={3}>Thái độ</Select.Option>
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
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CreatePLO;
