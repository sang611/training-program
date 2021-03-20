import {Button, Col, Drawer, Form, Input, message, Row, Space, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../redux/actions";
import {useEffect, useState} from 'react'
import axios from "axios";
import Checkbox from "antd/es/checkbox/Checkbox";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


const ListLocs = ({trainingProgram}) => {
    const [locs, setLocs] = useState([]);
    const [choosedLocs, setChoosedLocs] = useState([]);
    const dispatch = useDispatch();
    const state = useSelector(state => state.learningOutcomes);

    useEffect(() => {
        dispatch(actions.getAllLearningOutcomes({typeLoc: 1}));
    }, [])

    useEffect(() => {
        state.locs.forEach((loc) => {
            loc.key = loc.uuid;
        })

        setLocs(
            state.locs.filter((loc) => {
                return loc.parent_uuid == null;
            })
        );
    }, [state])


    const columns = [
        {
            title: 'Nội dung chuẩn đầu ra',
            dataIndex: 'content',
            key: 'content',
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    useEffect(() => {
        if (trainingProgram.learning_outcomes)
            setSelectedRowKeys(
                trainingProgram.learning_outcomes.map((loc) => loc.uuid)
            )
    }, [])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setChoosedLocs(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys)
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },

        selectedRowKeys: selectedRowKeys
    };


    const onAddLocsToTrainingProgram = () => {
        console.log(choosedLocs)
        axios.post("/training-programs/learning-outcomes", {
            trainingUuid: trainingProgram.uuid,
            locs: choosedLocs
        })
            .then((res) => {message.success("Cập nhật CĐR thành công")})
            .catch((e) => {message.error(e.response.data.message)})
    }

    const [parentOutcome, setParentOutcome] = useState(null);
    const [visibleDrawer, setVisibleDrawer] = useState(false);

    const showDrawer = () => {
        setVisibleDrawer(true)
    };
    const onCloseDrawer = () => {
        setVisibleDrawer(false);
    };

    const checkStrictly = true;

    const Footer = () => {
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Button type="primary" onClick={onAddLocsToTrainingProgram}>Cập nhật</Button>
                    </Col>
                    <Col>
                        <Button type="primary" danger onClick={showDrawer}>Tạo mới CĐR</Button>
                    </Col>
                </Row>

            </>
        )
    }

    return <>
        <Table
            loading={state.loading}
            pagination={false}
            columns={columns}
            dataSource={locs}
            rowSelection={{...rowSelection, checkStrictly}}
            expandable={{indentSize: 40}}
            footer={()=><Footer />}
        />
        <Drawer
            title={`Thêm mới chuẩn đầu ra: ${parentOutcome ? parentOutcome.content : ""}`}
            width={720}
            onClose={onCloseDrawer}
            visible={visibleDrawer}
            bodyStyle={{paddingBottom: 80}}
        >
            <CreateLOC parentOutcome={parentOutcome} onClose={onCloseDrawer}/>
        </Drawer>

    </>
}

const CreateLOC = ({parentOutcome, onClose}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const onFinish = ({contents}) => {
        const data = {
            contents: contents,
            parent_uuid: parentOutcome ? parentOutcome.uuid : null,
            category: 1,
            order: parentOutcome ? parentOutcome.order+1 : 1
        }

        console.log(data)
        axios.post("/learning-outcomes", data)
            .then((res) => {
                message.success("CĐR được thêm thành công")
                dispatch(actions.getAllLearningOutcomes({typeLoc: 1}))
                onClose();
            })
            .catch((e) => message.error("Đã có lỗi xảy ra"))
        form.resetFields();
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: {span: 24, offset: 0},
            sm: {span: 20, offset: 0},
        },
    };
    const formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 20},
        },
    };
    return (
        <>
            <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
                <Form.List
                    name="contents"
                    rules={[{required: true, message: 'Tạo ít nhất 1 nội dung CĐR'}]}
                >
                    {(fields, {add, remove}, {errors}) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    /*label={index === 0 ? 'Nội dung' : ''}*/
                                    required={true}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: "Nhập nội dung CĐR",
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Row>
                                            <Col span={22}>
                                                <Input.TextArea placeholder="Mô tả"
                                                                style={{width: '100%'}}/>
                                            </Col>
                                            <Col span={2}>
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)}
                                                />
                                            </Col>

                                        </Row>

                                    </Form.Item>

                                </Form.Item>
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
                                <Form.ErrorList errors={errors}/>
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

const AddTrainingProgramLOC = ({trainingProgram}) => {

    return (
        <>
            <ListLocs trainingProgram={trainingProgram}/>

        </>
    )
}

export default AddTrainingProgramLOC;