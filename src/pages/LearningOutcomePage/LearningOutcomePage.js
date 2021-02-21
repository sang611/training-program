import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Drawer, Form, Input, message, Select, Space, TreeSelect} from "antd";
import {useState, useEffect} from 'react'
import {Option} from "antd/lib/mentions";
import {TreeNode} from "antd/lib/tree-select";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions/index"

const LearningOutcomePage = () => {
    const [visible, setVisible] = useState(false);
    const [parentOutcome, setParentOutcome] = useState(null);
    const dispatch = useDispatch();
    const state = useSelector(state => state.learningOutcomes);

    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes());
    }, [])

    const showDrawer = () => {
        setVisible(true)
    };
    const onClose = () => {
        setVisible(false);
    };

    const CreateForm = () => {
        const [form] = Form.useForm();
        const [typeCdr, setTypeCdr] = useState(undefined)
        const areas = [
            {label: 'Beijing', value: 'Beijing'},
            {label: 'Shanghai', value: 'Shanghai'},
        ];

        const sights = {
            Beijing: ['Tiananmen', 'Great Wall'],
            Shanghai: ['Oriental Pearl', 'The Bund'],
        };
        const onFinish = values => {
            console.log('Received values of form:', values);
            const data = {
                contents: values.learningOutcomes
            }
            axios.post("/learning-outcomes", data)
                .then((res) => {
                    message.success("CĐR được thêm thành công")
                })
                .catch((e) => message.error("Đã có lỗi xảy ra"))
        };

        const handleChange = () => {
            form.setFieldsValue({sights: []});
        };
        const onChange = value => {
            console.log(value);
            setTypeCdr(value)
        };
        return (
            <>
                <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                    <TreeSelect
                        showSearch
                        style={{width: '100%'}}
                        value={typeCdr}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="Please select"
                        allowClear
                        treeDefaultExpandAll
                        onChange={onChange}
                    >
                        {/*<TreeNode value="1" title="Về kiến thức và năng lực chuyên môn">
                            <TreeNode value="1-1" title="Về kiến thức">
                                <TreeNode value="1-1-1" title="Khối kiến thức chung"/>
                                <TreeNode value="1-1-2" title="Kiến thức theo lĩnh vực"/>
                                <TreeNode value="1-1-3" title="Kiến thức theo khối ngành"/>
                                <TreeNode value="1-1-4" title="Kiến thức theo nhóm ngành"/>
                                <TreeNode value="1-1-5" title="Kiến thức ngành"/>
                            </TreeNode>
                            <TreeNode value="1-2" title="Năng lực tự chủ và trách nhiệm">
                            </TreeNode>
                        </TreeNode>
                        <TreeNode value="2" title="Về kỹ năng">
                            <TreeNode value="2-1" title="Kỹ năng chuyên môn">
                                <TreeNode value="2-1-1" title="Các kỹ năng nghề nghiệp"/>
                                <TreeNode value="2-1-2" title="Khả năng lập luận tư duy và giải quyết vấn đề"/>
                                <TreeNode value="2-1-3" title="Khả năng nghiên cứu và khám phá kiến thức"/>
                                <TreeNode value="2-1-4"
                                          title="Kỹ năng đánh giá chất lượng công việc sau khi hoàn thành và kết quả thực hiện của các thành viên trong nhóm"/>
                                <TreeNode value="2-1-5" title="Bối cảnh xã hội và ngoại cảnh"/>
                                <TreeNode value="2-1-6" title="Các kỹ năng nghề nghiệp"/>
                                <TreeNode value="2-1-7"
                                          title="Kỹ năng truyền đạt vấn đề và giải pháp tới người khác tại nơi làm việc; chuyển tải, phổ biến kiến thức, kỹ năng trong việc thực hiện những nhiệm vụ cụ thể hoặc phức tạp"/>
                                <TreeNode value="2-1-8" title="Năng lực vận dụng kiến thức, kỹ năng vào thực tiễn"/>
                                <TreeNode value="2-1-9"
                                          title="Kỹ năng dẫn dắt, khởi nghiệp, tạo việc làm cho mình và cho người khác"/>
                            </TreeNode>
                            <TreeNode value="2-2" title="Kỹ năng bổ trợ">
                                <TreeNode value="2-2-1" title="Các kỹ năng cá nhân"/>
                                <TreeNode value="2-2-2" title="Làm việc theo nhóm"/>
                                <TreeNode value="2-2-3" title="Quản lý và lãnh đạo"/>
                                <TreeNode value="2-2-4" title="Kỹ năng giao tiếp"/>
                                <TreeNode value="2-2-5" title="Kỹ năng giao tiếp sử dụng ngoại ngữ"/>
                                <TreeNode value="2-2-6" title="Các kỹ năng bổ trợ khác"/>
                            </TreeNode>
                        </TreeNode>
                        <TreeNode value="3" title="Về phẩm chất đạo đức">
                            <TreeNode value="3-1" title="Phẩm chất đạo đức cá nhân"/>
                            <TreeNode value="3-2" title="Phẩm chất Pháp luật và đạo đức nghề nghiệp trong CNTT"/>
                            <TreeNode value="3-3" title="Phẩm chất đạo đức xã hội"/>
                        </TreeNode>*/}
                    </TreeSelect><br/><br/>
                    <Form.List name="learningOutcomes">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(field => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item
                                            {...field}
                                            label="Nội dung"
                                            name={[field.name, 'content']}
                                            fieldKey={[field.fieldKey, 'content']}
                                            rules={[{required: true, message: 'Nội dung không được để trống'}]}
                                        >
                                            <Input.TextArea/>
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Tạo CĐR
                                    </Button>
                                </Form.Item>
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


    return (
        <>
            <Button
                type="primary"
                shape="circle"
                danger
                icon={<PlusOutlined/>}
                size={"large"}
                style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 32
                }}
                onClick={showDrawer}
            />
            <Drawer
                title="Thêm mới chuẩn đầu ra"
                width={720}
                onClose={onClose}
                visible={visible}
                bodyStyle={{paddingBottom: 80}}
                /*footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={onClose} type="primary">
                            Submit
                        </Button>
                    </div>
                }*/
            >
                <CreateForm/>
            </Drawer>
        </>
    )
}

export default LearningOutcomePage;