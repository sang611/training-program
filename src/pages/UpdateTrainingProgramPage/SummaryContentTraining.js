import Title from "antd/lib/typography/Title";
import React, {useState, useEffect} from "react";
import {Button, Form, InputNumber, message} from "antd";
import axios from "axios";

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} phải là 1 số!',
    types: {
        number: '${label} không phải là 1 số!',
    },
    number: {
        range: '${label} phải nằm trong khoảng ${min} and ${max}',
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
        console.log(values);
        axios.put(`/training-programs/${trainingProgram.uuid}`, {
            require_summary: JSON.stringify(values)
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
            max: 200,
        },
    ]

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
                    label={<Title level={5}>Tổng số tín chỉ của chương trình đào tạo</Title>}
                    rules={rules}
                    colon={false}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="common"
                    label="Khối kiến thức chung"
                    rules={rules}
                >
                    <InputNumber/>
                </Form.Item>
                <Form.Item
                    name="field"
                    label="Khối kiến thức theo lĩnh vực"
                    rules={rules}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="major_unit"
                    label="Khối kiến thức theo khối ngành"
                    rules={rules}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="major_group"
                    label="Khối kiến thức theo nhóm ngành"
                    rules={rules}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    name="major"
                    label="Khối kiến thức ngành"
                    rules={rules}
                >
                    <InputNumber />
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