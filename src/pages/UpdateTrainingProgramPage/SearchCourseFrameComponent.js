import {Row, Col, Form, Input, Button} from "antd";
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

    const onFinish = ({course_name_vi, course_name_en, course_code}) => {

        setDataSource(
            generateDataFrame(trainingProgram).filter(
                (data) => {
                    return (
                        data.uuid &&
                        data.course_name_vi.toLowerCase().includes(course_name_vi.toLowerCase()) &&
                        data.course_name_en.toLowerCase().includes(course_name_en.toLowerCase()) &&
                        data.course_code.toLowerCase().includes(course_code.toLowerCase())
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
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item
                            name="course_code"
                            label="Mã học phần"
                        >
                            <Input placeholder="Tìm kiếm theo mã học phần"/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="course_name_vi"
                            label="Tên học phần (VI)"
                        >
                            <Input placeholder="Tìm kiếm theo tên học phần"/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
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