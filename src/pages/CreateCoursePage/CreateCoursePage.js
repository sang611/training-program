import {Button, Col, Form, Input, InputNumber, message, Row, Select} from "antd";
import {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import axios from "axios";
import Title from "antd/lib/typography/Title";

const CreateCoursePage = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const insState = useSelector(state => state.institutions)
    useEffect(() => {
        dispatch(actions.getAllInstitution());
    }, [])

    async function onCreateCourse(values) {
        try {
            const response = await axios.post("/courses/creation", values)
            console.log(response.status)
            if (response.status === 201) {
                message.success("Tạo mới học phần thành công")
            }
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }

    }


    return (
        <>
            <Form

                layout="vertical"
                form={form}
                onFinish={onCreateCourse}
            >
                <Title level={3}>Thêm mới học phần</Title>
                <Row>
                    <Col span={15} offset={1}>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="Tên học phần (VN):" name="vn_name">
                                    <Input placeholder="Tên hcoj phần bằng Tiếng Việt"
                                           addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                                </Form.Item>
                                <Form.Item label="Tên học phần (EN):" name="en_name">
                                    <Input placeholder="Tên học phần bằng Tiếng Anh"
                                           addonBefore={<i className="fas fa-text-width" style={{color: '#1890FF'}}/>}/>
                                </Form.Item>
                                <Form.Item label="Mã học phần:" name="course_code">
                                    <Input placeholder="Nhập mã học phần"
                                           addonBefore={<i className="fas fa-code" style={{color: '#1890FF'}}/>}/>
                                </Form.Item>

                                <Form.Item label="Số tín chỉ:" name="credits">
                                    <InputNumber min={1} max={20} defaultValue={0}/>
                                </Form.Item>
                                <Form.Item label="Đơn vị chuyên môn:" name="institution">
                                    <Select
                                        showSearch
                                        style={{width: '100%'}}
                                        placeholder="Đơn vị chuyên môn phụ trách học phần"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            insState.listInstitutions.map((ins, index) =>
                                                <Select.Option value={ins.uuid} key={index}>{ins.vn_name}</Select.Option>
                                            )
                                        }

                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Submit</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
};

export default CreateCoursePage;