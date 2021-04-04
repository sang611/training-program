import {Table} from "antd";

const ListCourseStatic = ({dataSource}) => {

    const columns = [
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
            key: 'course_code',
        },
        {
            title: 'Tên học phần',
            dataIndex: 'course_name_vi',
            key: 'course_name_vi',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits',
            key: 'credits',
        },
    ];
    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered
            /><br/><br/>
        </>
    )
}

export default ListCourseStatic;