import {Button, Form, Input, InputNumber, message, Space} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import * as actionTypes from '../../redux/actions/actionTypes'
import * as actions from '../../redux/actions'
import {useState, useEffect, useRef} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {useForm} from "antd/lib/form/Form";

const CreateInstitutionPage = (props) => {
    const {isEdited, institution, parentIns} = props;
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(new FormData());
    const state = useSelector((state) => state.institutions)
    const {isValidToken} = useSelector(state => state.auth)

    useEffect(() => {
        if (state.createSuccess) {
            message.success("Đã thêm một đơn vị mới");
        }
    }, [state])

    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 15,
        },
    };


    const onFinish = (values) => {

        formData.set('vn_name', values.vn_name || "");
        formData.set('en_name', values.en_name || "");
        formData.set('abbreviation', values.abbreviation || "");
        formData.set('address', values.address || "");
        formData.set('description', values.description || "");
        if(parentIns) {
            formData.set('parent_uuid', parentIns.uuid)
        }
        if(isEdited) {
            let {uuid} = props.institution;
            axios.put(`/institutions/${uuid}`, formData)
                .then(() => {
                    message.success("Cập nhật đơn vị thành công");
                    props.editSuccess(true);
                })
                .catch((e) => message.error("Đã có lỗi xảy ra"));
        } else {
            dispatch(actions.createInstitution(formData))
        }

    };

    const propsDragger = {
        name: 'file',
        headers: {
            "Content-Type": "multipart/form-data"
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const [form] = Form.useForm();
    useEffect(() => {
        if(isEdited) {
            form.setFieldsValue(institution)
        }
    }, [])

    return !isValidToken ? <Redirect to="/uet/signin"/> : (
        <Form
            {...layout}
            form={form}
            name="nest-messages"
            onFinish={onFinish}
        >
            <Form.Item
                name={'vn_name'}
                label="Tên đơn vị (VN)"
                rules={[
                    {
                        required: true,
                        message: 'Tên đơn vị không được để trống'
                    },
                ]}
            >
                {
                    props.institution ? <Input

                    /> : <Input />
                }

            </Form.Item>
            <Form.Item
                name={'en_name'}
                label="Tên đơn vị (EN)"
                rules={[
                    {
                        required: true,
                        message: 'Tên đơn vị không được để trống'
                    },
                ]}
            >

                   <Input />

            </Form.Item>
            <Form.Item
                name={'abbreviation'}
                label="Tên đơn vị (ABV)"
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={'address'}
                label="Địa chỉ"
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={'description'}
                label="Mô tả sơ lược">
                <Input.TextArea />
            </Form.Item>

            <Form.Item name={'logo'} label="Logo">
                <Dragger {...propsDragger} beforeUpload={(file) => {
                    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                    if (!isJPG) {
                        message.error('Vui lòng chọn file JPEG hoặc PNG!');
                    } else {
                        formData.set("logo", file);
                    }
                    return false;
                }
                }>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">Click hoặc kéo thả logo vào đây</p>
                    <p className="ant-upload-hint">
                        Chỉ cho phép tải lên file ảnh dưới định dạng jpeg, png.
                    </p>
                </Dragger>
            </Form.Item>

            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 5}}>
                <Space>
                    {
                        props.isEdited ?
                            <Button onClick={props.onCloseDrawer}>
                                Cancel
                            </Button> : ""
                    }

                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Space>

            </Form.Item>
        </Form>
    )
}

export default CreateInstitutionPage;
