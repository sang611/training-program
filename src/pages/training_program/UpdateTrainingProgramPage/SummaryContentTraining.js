import Title from "antd/lib/typography/Title";
import React, {useState, useEffect} from "react";
import {Button, Form, InputNumber, message} from "antd";
import axios from "axios";

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    types: {
        number: 'Giá trị phải là 1 số!',
    },
    number: {
        range: 'Giá trị phải nằm trong khoảng ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

const SummaryContentTraining = ({trainingProgram}) => {
    const [form] = Form.useForm();
    const requireSummary = JSON.parse(trainingProgram.require_summary)

    useEffect(() => {
        form.setFieldsValue(requireSummary)
    }, [])


    const onFinish = (values) => {
        const {major_unit_L, major_group_L, major_L, major_BT} = values;
        console.log(values)
        axios.put(`/training-programs/${trainingProgram.uuid}`, {
            require_summary: JSON.stringify(values),
            require_L: (major_unit_L || 0) + (major_group_L || 0) + (major_L || 0),
            require_BT: (major_BT || 0)
        })
            .then(res => {
                message.success(res.data.message);
            })
            .catch(e => {
                if(e.response) {
                    message.error(e.response.data.message)
                } else {
                    message.error(e.message)
                }
            })

    };

    const rules=[
        {
            type: 'number',
            min: 0,
            max: 1000,
        },
    ]

    const majorBlockStyle = {fontWeight: 'bold'}, courseTypeStyle={fontStyle: 'italic', marginLeft: '40px'}

    return (
        <>
            <Title level={3}>
                PHẦN III: NỘI DUNG CHƯƠNG TRÌNH ĐÀO TẠO
            </Title>
            <Title level={4}>
                Tóm tắt yêu cầu chương trình đào tạo
            </Title>
            <Form
                form={form}
                labelCol={{span: 10}}
                labelAlign="left"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item
                    name="total"
                    label={<Title level={5} style={majorBlockStyle}>Tổng số tín chỉ của chương trình đào tạo</Title>}
                    rules={rules}
                    colon={false}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="common"
                    label={<span style={majorBlockStyle}>Khối kiến thức chung</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="field"
                    label={<span style={majorBlockStyle}>Khối kiến thức theo lĩnh vực</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_unit"
                    label={<span style={majorBlockStyle}>Khối kiến thức theo khối ngành</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_unit_B"
                    label={<span style={courseTypeStyle}>Các học phần bắt buộc</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_unit_L"
                    label={<span style={courseTypeStyle}>Các học phần tự chọn</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_group"
                    label={<span style={majorBlockStyle}>Khối kiến thức theo nhóm ngành</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_group_B"
                    label={<span style={courseTypeStyle}>Các học phần bắt buộc</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_group_L"
                    label={<span style={courseTypeStyle}>Các học phần tự chọn</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major"
                    label={<span style={majorBlockStyle}>Khối kiến thức ngành</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>

                <Form.Item
                    name="major_B"
                    label={<span style={courseTypeStyle}>Các học phần bắt buộc</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_L"
                    label={<span style={courseTypeStyle}>Các học phần tự chọn</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_BT"
                    label={<span style={courseTypeStyle}>Các học phần bổ trợ</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>
                <Form.Item
                    name="major_KLTN"
                    label={<span style={courseTypeStyle}>Khóa luận tốt nghiệp/Các học phần thay thế</span>}
                    rules={rules}
                >
                    <InputNumber min={0} max={1000}/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </>

    )
}

export default SummaryContentTraining;