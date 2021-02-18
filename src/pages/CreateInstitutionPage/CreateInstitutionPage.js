import {Button, Form, Input, InputNumber, message} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import * as actionTypes from '../../redux/actions/actionTypes'
import * as actions from '../../redux/actions'
import {useState, useEffect} from "react";
import {Redirect} from "react-router-dom";

const CreateInstitutionPage = (props) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(new FormData());
    const state = useSelector((state) => state.institutions)
    const {isValidToken} = useSelector(state => state.auth)

    useEffect(() => {
        if(state.response.status === 401) {
            dispatch(actions.authLogout())
        }
        if(state.response.status === 201) {
            message.success("Đã thêm một đơn vị mới");
        }
    }, [state])

    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 12,
        },
    };

    const validateMessages = {
        required: '${label} không được để trống!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const onFinish = (values) => {
        console.log(values.institution);
        formData.set('vn_name', values.institution.vn_name);
        formData.set('en_name', values.institution.en_name);
        formData.set('abbreviation', values.institution.abbreviation);
        formData.set('address', values.institution.address);
        formData.set('description', values.institution.description);
        dispatch(actions.createInstitution(formData))
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

    return !isValidToken ? <Redirect to="/uet/signin" /> : (
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item
                name={['institution', 'vn_name']}
                label="Tên đơn vị (VN)"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={['institution', 'en_name']}
                label="Tên đơn vị (EN)"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={['institution', 'abbreviation']}
                label="Tên đơn vị (ABV)"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={['institution', 'address']}
                label="Địa chỉ"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={['institution', 'description']}
                label="Mô tả sơ lược">
                <Input.TextArea/>
            </Form.Item>

            <Form.Item name={['institution', 'logo']} label="Logo">
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

            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 4}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default CreateInstitutionPage;