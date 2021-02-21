import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as actions from '../../redux/actions/index'
import {message, Popconfirm, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, InfoCircleOutlined} from "@ant-design/icons";
import axios from "axios";

const {Column, ColumnGroup} = Table;

const ListCoursePage = () => {
    const dispatch = useDispatch();
    const courseState = useSelector(state => state.courses)
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        dispatch(actions.getAllCourse())
    }, [])

    useEffect(() => {
        if (courseState.response.data) {
            const dataSource = courseState.response.data.courses.map((course, index) => {
                return {
                    ...course,
                    key: index
                }

            })
            setDataSource(dataSource);
        }
    }, [courseState])

    function deleteCourse({uuid}) {

        axios.delete(`/courses/${uuid}`)
            .then((response) => {
                message.success(response.data.message)
                setDataSource(
                    dataSource.filter((course) => course.uuid !== uuid)
                )
            })
    }

    return (
        <>
            <Table
                dataSource={dataSource}
                loading={courseState.loading}
                bordered
            >
                <ColumnGroup title="Tên học phần">
                    <Column title="Tiếng Việt" dataIndex="course_name_vi" key="course_name_vi"/>
                    <Column title="Tiếng Anh" dataIndex="course_name_en" key="course_name_en"/>
                </ColumnGroup>
                <Column title="Mã học phần" dataIndex="course_code" key="course_code"/>
                <Column title="Số tín chỉ" dataIndex="credits" key="credits"/>
                {/*<Column
                    title="Đơn vị phụ trách"
                    dataIndex="institution"
                    key="institution"
                    render={
                        (ins) => ins.vn_name
                    }
                />*/}
                <Column
                    title="Thao tác"
                    key="action"
                    render={(text, record) => (
                        <Space size="small">
                            <a>
                                <Tag icon={<EditOutlined/>} color="#55acee">
                                    Edit
                                </Tag>
                            </a>
                            <a>
                                <Tag icon={<DeleteOutlined/>} color="#cd201f">

                                    <Popconfirm
                                        title="Xóa học phần này?"
                                        onConfirm={() => {
                                            deleteCourse(record);
                                        }}
                                    >
                                        Delete
                                    </Popconfirm>
                                </Tag>
                            </a>

                            <a>
                                <Tag icon={<InfoCircleOutlined/>} color="#87d068">
                                    Detail
                                </Tag>
                            </a>


                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

export default ListCoursePage;