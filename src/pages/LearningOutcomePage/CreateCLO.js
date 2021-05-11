import {useDispatch} from "react-redux";
import {Button, Col, Form, Input, message, Pagination, Row, Select, Space} from "antd";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as actions from "../../redux/actions";
import {Option} from "antd/lib/mentions";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {locTypes} from "../../constants";

const CreateCLO = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [locs, setLocs] = useState([]);
    const [plos, setPlos] = useState([]);
    const [searchContent, setSearchContent] = useState("");
    const [totalLocs, setTotalLocs]=  useState(0);
    const [page, setPage] = useState(1);
    useEffect(() => {
        axios.get(`/learning-outcomes/1/?content=${searchContent}&page=${page}`)
            .then((res) => {
                setLocs(res.data.learningOutcomes)
                setTotalLocs(res.data.totalResults)
            })
    }, [searchContent, page])

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
        setPage(1);
        setSearchContent("")
    }

    function onSearch(value) {
        setSearchContent(value);
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
                onSearch={onSearch}
                filterOption={false}
                dropdownRender={(menu) => (
                    <>
                        {menu}
                        <br/>
                        <Row justify="space-around">
                            <Pagination
                                total={totalLocs}
                                current={page}
                                onChange={(page) => setPage(page)}
                            />
                        </Row>

                    </>

                )}
            >
                {
                    locs.map((loc) => {
                        return (
                            <Option key={loc.uuid}>{loc.content}</Option>
                        )
                    })
                }

            </Select><br/><br/>
            <Form
                form={form}
                name="dynamic_form_nest_item"
                onFinish={onFinish}
                autoComplete="off"
            >
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
                                            {
                                                locTypes.map(type => <Select.Option key={type.value} value={type.value}>{type.content}</Select.Option>)
                                            }
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
