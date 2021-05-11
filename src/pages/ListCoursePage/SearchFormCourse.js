import {Button, Cascader, Col, Form, Input, Row} from "antd";
import React, {useEffect, useState} from "react";
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {course} from "../../constants/Items";
import {SearchOutlined, SyncOutlined} from "@ant-design/icons";

const SearchFormCourse = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {listInstitutions} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);
    const {courses} = useSelector(state => state.courses)

    const initialSearchObj = {
        course_name_vi: "",
        course_name_en: "",
        course_code: "",
        institutionUuid: ""
    }

    const [searchObj, setSearchObj] = useState(initialSearchObj)

    useEffect(() => {
        dispatch(actions.getAllInstitution());
    }, [])

    useEffect(() => {
        handleInstitutionData(listInstitutions)
        setInstitutions(listInstitutions)
    }, [listInstitutions])

    useEffect(() => {
        dispatch(actions.getAllCourse({params: searchObj}))
    }, [searchObj])

    function handleInstitutionData(institutions) {
        for (let ins of institutions) {
            ins.value = ins.uuid;
            ins.label = ins.vn_name;
            if (ins.children && ins.children.length > 0) {
                handleInstitutionData(ins.children)
            }
        }
    }

    const onFinish = ({course_name_vi, course_name_en, course_code, institutionUuid}) => {
        setSearchObj({
            course_name_vi: course_name_vi || "",
            course_name_en: course_name_en || "",
            course_code: course_code || "",
            institutionUuid: institutionUuid ? institutionUuid[1] || "" : "",
        })
    };

    return (
        <>
            <Form
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
                onFinish={onFinish}
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
                            name="course_name_vi"
                            label="Tên học phần (VI)"
                        >
                            <Input placeholder="Tìm kiếm theo tên học phần"/>
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
                            name="institutionUuid"
                            label="Đơn vị phụ trách"
                        >
                            <Cascader
                                style={{width: '100%'}}
                                placeholder="Tìm kiếm theo đơn vị chuyên môn"
                                options={
                                    institutions.filter((ins) => !ins.parent_uuid)
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12} style={{textAlign: 'left'}}>
                        <i><b>
                            {`${courses.length} học phần`}
                        </b></i>

                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            Tìm kiếm
                        </Button>
                        <Button
                            style={{margin: '0 8px'}}
                            onClick={() => {
                                form.resetFields();
                                setSearchObj(initialSearchObj)
                            }}
                            icon={<SyncOutlined spin />}
                        >
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default SearchFormCourse;