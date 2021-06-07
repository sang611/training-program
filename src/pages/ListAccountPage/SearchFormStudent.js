import {Button, Cascader, Col, Form, Input, Row, Select} from "antd";
import {SearchOutlined, SyncOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";

const SearchFormStudent = ({currentPage, setCurrentPage, searchObj, setSearchObj}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {majors} = useSelector(state => state.majors);

    const initialSearchObj = {
        fullname: "",
        student_code: "",
        class: "",
        grade: "",
        majorUuid: ""
    }

    useEffect(() => {
        dispatch(actions.getAllMajor());
    }, [])

    const onSearch = (val) => {
        setSearchObj(val);
        setCurrentPage(1);
        dispatch(actions.fetchAccounts({
            page: 1,
            typeAccount: "SV",
            ...val
        }))
    }

    return (
        <>
            <Form
                form={form}
                onFinish={onSearch}
                style={{
                    backgroundColor: '#fbfbfb',
                    border: '1px solid #d9d9d9',
                    padding: '24px',
                    marginBottom: '30px',
                    borderRadius: '5px'
                }
                }
            >
                <Row gutter={50}>
                    <Col span={12}>
                        <Form.Item
                            name="fullname"
                            label="Họ tên"
                        >
                            <Input placeholder="Nhập tên sinh viên"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="student_code"
                            label="Mã sinh viên"
                        >
                            <Input placeholder="Mã sinh viên"/>
                        </Form.Item>
                    </Col>
                    <Col span={6} flex={'auto'}>
                        <Form.Item
                            name="class"
                            label="Lớp học phần"
                        >
                            <Input placeholder="CAC, CC, CB,..."/>
                        </Form.Item>
                    </Col>
                    <Col span={6} flex={'auto'}>
                        <Form.Item
                            name="grade"
                            label="Khóa"
                        >
                            <Input placeholder="K60, K61, K62,..."/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="majorUuid"
                            label="Ngành"
                        >
                            <Select placeholder="Ngành đào tạo sinh viên theo học">
                                {
                                    majors.map(major =>
                                        <Select.Option value={major.uuid} key={major.uuid}>{major.vn_name}</Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Col>

                </Row>
                <Row>
                    <Col span={12} style={{textAlign: 'left'}}>
                        <i><b>
                            {/*{`${courses.length} học phần`}*/}
                        </b></i>

                    </Col>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            Tìm kiếm
                        </Button>
                        <Button
                            style={{margin: '0 8px'}}
                            onClick={() => {
                                dispatch(actions.fetchAccounts({
                                    page: 1,
                                    typeAccount: "SV",
                                    ...initialSearchObj,
                                }))
                                setSearchObj(initialSearchObj)
                                form.resetFields();
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

export default SearchFormStudent;