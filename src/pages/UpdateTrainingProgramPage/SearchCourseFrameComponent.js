import {Row, Col, Form, Input, Button, Select} from "antd";
import React, {useEffect, useState} from "react";
import {SearchOutlined, SyncOutlined} from "@ant-design/icons";
import {generateDataFrame} from "../../utils/frameCourse";


const SearchCourseFrameComponent = ({setDataSource, trainingProgram}) => {
    const [form] = Form.useForm();
    const initialSearchObj = {
        course_name_vi: "",
        course_name_en: "",
        course_code: "",
    }

    const onFinish = ({course_name_vi, course_name_en, course_code, knowledgeType}) => {

        setDataSource(
            generateDataFrame(trainingProgram).filter(
                (data) => {
                    return (
                        data.uuid &&
                        data.course_name_vi.toLowerCase().includes(course_name_vi.toLowerCase()) &&
                        data.course_name_en.toLowerCase().includes(course_name_en.toLowerCase()) &&
                        data.course_code.toLowerCase().includes(course_code.toLowerCase()) &&
                        (knowledgeType && knowledgeType !== "ALL" ? data.training_program_course.knowledge_type === knowledgeType : true)
                    ) || !data.uuid
                }
            )
        )
    };

    return (
        <>
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={initialSearchObj}
                style={{
                    backgroundColor: '#fbfbfb',
                    border: '1px solid #d9d9d9',
                    padding: '24px',
                    marginBottom: '30px',
                    borderRadius: '5px'
                }
                }
            >
                <Row gutter={100}>
                    <Col span={12}>
                        <Form.Item
                            name="course_code"
                            label="Mã học phần"
                        >
                            <Input placeholder="Tìm kiếm theo mã học phần"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="course_name_vi"
                            label="Tên học phần (VI)"
                        >
                            <Input placeholder="Tìm kiếm theo tên học phần"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="knowledgeType"
                            label="Khối kiến thức"
                        >
                            <Select
                                placeholder="Khối kiến thức"
                                style={{width: '150px'}}

                                onChange={(val) => {
                                }}
                            >
                                <Select.Option value="ALL"
                                               key={1}>Tất cả</Select.Option>
                                <Select.Option value="C"
                                               key={1}>Chung</Select.Option>
                                <Select.Option value="LV"
                                               key={2}>Lĩnh vực</Select.Option>
                                <Select.Option value="KN"
                                               key={3}>Khối ngành</Select.Option>
                                <Select.Option value="NN"
                                               key={4}>Nhóm ngành</Select.Option>
                                <Select.Option value="N"
                                               key={4}>Ngành</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="course_name_en"
                            label="Tên học phần (EN)"
                        >
                            <Input placeholder="Tìm kiếm theo tên học phần"/>
                        </Form.Item>
                    </Col>


                </Row>
                <Row justify="end">
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                            Tìm kiếm
                        </Button>
                        <Button
                            style={{margin: '0 8px'}}
                            onClick={() => {
                                form.resetFields();
                                setDataSource(generateDataFrame(trainingProgram))
                            }}
                            icon={<SyncOutlined spin/>}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default SearchCourseFrameComponent;