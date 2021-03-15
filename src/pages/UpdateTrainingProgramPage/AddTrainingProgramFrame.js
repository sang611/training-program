import React, { useState, useEffect } from 'react';
import {Table, Input, InputNumber, Popconfirm, Form, Typography, Select, Button, Drawer, message, Space} from 'antd';
import * as actions from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import Title from "antd/lib/typography/Title";
import AddTrainingProgramCourses from "./AddTrainingProgramCourses";
import axios from "axios";

const originData = [];

for (let i = 0; i < 10; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const courseState = useSelector(state => state.courses)
    const inputNode = inputType === 'number' ? <InputNumber /> :
        <Select
            showSearch
            placeholder="Tên học phần"
            optionFilterProp="children"
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            {
                courseState.response.data ? courseState.response.data.courses.map((course, index) =>
                    <Select.Option value={course.uuid}
                                   key={index}>{course.course_name_vi}</Select.Option>
                ) : []
            }

        </Select>
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const AddTrainingProgramFrame = ({trainingProgram}) => {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState(trainingProgram.courses);
    const [editingKey, setEditingKey] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])
    const courseState = useSelector(state => state.courses)

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const courseSelected = courseState.response.data.courses.filter((course) => course.uuid === row.course_name_vi)[0] || {}

            if(courseSelected) {
                courseSelected.key = courseSelected.uuid
            }

            const newData = [...dataSource];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...courseSelected,
                    training_program_course: row.training_program_course
                });

                axios.put(`/training-programs/courses/${trainingProgram.uuid}/${key}`, {
                    courseUuid: courseSelected.uuid,
                    ...row.training_program_course
                })
                    .then((res) => {
                        message.success("Cập nhật thành công");
                    })
                    .catch((e) => message.error("Đã có lỗi xảy ra"));

                setDataSource(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setDataSource(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const onDeleteCourse = (courseUuid) => {
        axios.delete(`/training-programs/courses/${trainingProgram.uuid}/${courseUuid}`)
            .then((res) => {
                message.success(res.data.message);
            })
            .then(() => {
                const newData = [...dataSource];
                setDataSource(
                    newData.filter((c) => c.uuid !== courseUuid)
                )
            })
            .catch((e) => message.error("Đã có lỗi xảy ra"));
    }

    const getNewCoursesAdded = (listCourses) => {
        setDataSource([...dataSource, ...listCourses])
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
        },
        {
            title: 'Tên học phần (vi)',
            dataIndex: 'course_name_vi',
            editable: true,
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
        },
        {
            title: 'Số giờ lý thuyết',
            dataIndex: ['training_program_course', 'theory_time'],
            editable: true,
        },
        {
            title: 'Số giờ bài tập',
            dataIndex: ['training_program_course', 'exercise_time'],
            editable: true,

        },
        {
            title: 'Số giờ thực hành',
            dataIndex: ['training_program_course', 'practice_time'],
            editable: true,

        },

        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <a
                onClick={() => {
                    console.log(record)
                    save(record.uuid)
                }}
                style={{
                    marginRight: 8,
                }}
            >
              Lưu
            </a>
            <Popconfirm title="Chắc chắn thoát?" onConfirm={cancel}>
              <a>Thoát</a>
            </Popconfirm>
          </span>
                ) : (
                    <>
                        <Space>
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                Sửa
                            </Typography.Link>
                            <Popconfirm title="Học phần sẽ được xóa khỏi CTĐT?" onConfirm={() => onDeleteCourse(record.uuid)}>
                                <Typography.Link>
                                    Xóa
                                </Typography.Link>
                            </Popconfirm>
                        </Space>

                    </>

                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }


        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'course_name_vi' ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const [visibleDrawer, setVisibleDrawer] = useState(false);

    const showDrawer = () => {
        setVisibleDrawer(true)
    };
    const onCloseDrawer = () => {
        setVisibleDrawer(false);
    };
    return (
        <>
            <Title level={4}>
                 Khung chương trình đào tạo &nbsp;
                {/*<Switch
                    checkedChildren="Thêm bằng file"
                    unCheckedChildren="Thêm "
                    defaultChecked
                    onChange={(value) => {
                        setUploadFile(value);
                    }}
                />
                <br/>*/}
            </Title>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataSource ? dataSource.map((data, index) => {
                        data.key=data.uuid;
                        data.stt = index+1;
                        return data;
                    }) : []}
                    pagination={false}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    footer={()=><Button type="primary" onClick={showDrawer}>Thêm học phần</Button>}
                />
            </Form>
            <Drawer
                title={`Thêm học phần vào khung đào tạo:`}
                width={900}
                onClose={onCloseDrawer}
                visible={visibleDrawer}
                bodyStyle={{paddingBottom: 80}}
            >
                <AddTrainingProgramCourses onCloseDrawer={onCloseDrawer} getNewCoursesAdded={getNewCoursesAdded}/>
            </Drawer>
        </>

    );
};
export default AddTrainingProgramFrame;