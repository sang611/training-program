import {Button, Cascader, Col, Form, Input, Row} from "antd";
import {SearchOutlined, SyncOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions";

const SearchFormLecturer = ({currentPage, setCurrentPage, searchObj, setSearchObj}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {listInstitutions} = useSelector(state => state.institutions)
    const [institutions, setInstitutions] = useState([]);

    const initialSearchObj = {
        fullname: "",
        vnu_mail: "",
        academic_rank: "",
        academic_degree: "",
        institutionUuid: ""
    }


    const onSearch = (val) => {
        setSearchObj({
            ...val,
            institutionUuid: val.institutionUuid ? val.institutionUuid[1] || val.institutionUuid[0] : ""
        });
        setCurrentPage(1);
        dispatch(actions.fetchAccounts({
            page: 1,
            typeAccount: "GV",
            ...val,
            institutionUuid: val.institutionUuid ? val.institutionUuid[1] || val.institutionUuid[0] : ""
        }))
    }

    useEffect(() => {
        dispatch(actions.getAllInstitution());
    }, [])

    useEffect(() => {
        handleInstitutionData(listInstitutions)
        setInstitutions(listInstitutions)
    }, [listInstitutions])

    function handleInstitutionData(institutions) {
        for (let ins of institutions) {
            ins.value = ins.uuid;
            ins.label = ins.vn_name;
            if (ins.children && ins.children.length > 0) {
                handleInstitutionData(ins.children)
            }
        }
    }

    return (
        <>
            <Form
                form={form}
                onFinish={onSearch}
            >
                <Row gutter={50}>
                    {/*<Col span={12}>
                        <Form.Item
                            name="fullname"
                            label="Họ tên"
                        >
                            <Input placeholder="Nhập tên giảng viên"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="vnu_mail"
                            label="Email (vnu)"
                        >
                            <Input placeholder="Email vnu của giảng viên"/>
                        </Form.Item>
                    </Col>
                    <Col span={6} flex={'auto'}>
                        <Form.Item
                            name="academic_rank"
                            label="Học hàm"
                        >
                            <Input placeholder="Học hàm của giảng viên"/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="academic_degree"
                            label="Học vị"
                        >
                            <Input placeholder="Học vị của giảng viên"/>
                        </Form.Item>
                    </Col>*/}
                    <Col span={12}>
                        <Form.Item
                            name="textSearch"
                            label="Nhập từ tìm kiếm"
                        >
                            <Input placeholder="Nhập họ tên, email, học vị,..."/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="institutionUuid"
                            label="Đơn vị chuyên môn"
                        >
                            <Cascader
                                style={{width: '100%'}}
                                placeholder="Đơn vị chuyên môn của giảng viên"
                                options={

                                        institutions
                                            .filter((ins) => !ins.parent_uuid)

                                }
                                changeOnSelect
                            />
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
                                    typeAccount: "GV",
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

export default SearchFormLecturer;