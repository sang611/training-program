import {Link} from "react-router-dom";
import {Button, Card, Descriptions, message, Modal, Popconfirm, Table} from "antd";
import {
    BuildOutlined,
    DeleteOutlined,
    EditOutlined,
    InfoOutlined,
    InsertRowBelowOutlined,
    LockOutlined, UnlockOutlined
} from "@ant-design/icons";
import Icon from "@ant-design/icons/es";
import axios from "axios";
import * as actions from "../../redux/actions";
import {useDispatch} from "react-redux";
import {useMemo, useState} from "react";

const ListCourseOfTraining = ({visibleCourseList, setVisibleCourseList, trainingItem}) => {
    const columns = [
        {
            title: "Mã học phần",
            dataIndex: "course_code",
            key: "course_code"
        },
        {
            title: "Tên học phần",
            children: [
                {
                    title: "Tên học phần (vi)",
                    dataIndex: "course_name_vi",
                    key: "course_name_vi"
                },
                {
                    title: "Tên học phần (en)",
                    dataIndex: "course_name_en",
                    key: "course_name_en"
                }
            ]
        },
        {
            title: "Số tín chỉ",
            dataIndex: "credits",
            key: "credits"
        },
    ]
    return (
        <>
            <Modal
                visible={visibleCourseList}
                title={`Danh sách học phần - ${trainingItem ? trainingItem.vn_name : ""}`}
                okText="OK"
                className="modal-courses-training"
                onCancel={() => {
                    setVisibleCourseList(false);
                }}
                onOk={() => {
                    setVisibleCourseList(false);
                }}
                footer={null}
            >
                <Table
                    columns={columns}
                    dataSource={trainingItem ? trainingItem.courses : []}
                    bordered
                    pagination={false}
                />


            </Modal>
        </>
    )
}

const MatrixLearningOutcomes = ({trainingItem, levelLocs}) => {

    const columns = [
        {
            title: 'CĐR/HP',
            dataIndex: 'content',
            fixed: 'left',
            width: 200
        }
    ].concat(
        trainingItem.courses.map(course => {
            return {
                title: course.course_name_vi,

                render: (_, loc) => {

                    let outline = course.outlines[0];
                    if (outline) {
                        let locsOfCourse = outline.learning_outcomes;

                        let clos = loc.clos.map(clo => clo.uuid);

                        let point = 0;

                        locsOfCourse.forEach(locOfCourse => {
                            if (clos.includes(locOfCourse.uuid)) {
                                point += locOfCourse.outline_learning_outcome.level;
                            }
                        })

                        if (point > 0) {
                            let levelLoc = levelLocs.find(levelLoc => levelLoc.locUuid === loc.uuid)

                            if (!levelLoc.levels.map(level => level.course).includes(course.uuid)) {
                                levelLoc.levels.push({course: course.uuid, point})
                            }

                            return point;
                        }

                        return "";
                    }
                    return ""
                }
            }
        })
            .concat(
                [
                    {
                        title: 'Tổng môn',
                        dataIndex: 'num_of_course',
                        fixed: 'right',
                        width: 100,
                        render: (_, loc) => {
                            let num = levelLocs.find(levelLoc => levelLoc.locUuid === loc.uuid).levels.length;
                            return num > 0 ? num : ''
                        }
                    },
                    {
                        title: 'Tổng điểm',
                        dataIndex: 'sum_of_level',
                        fixed: 'right',
                        width: 100,
                        render: (_, loc) => {
                            let summary = levelLocs
                                .find(levelLoc => levelLoc.locUuid === loc.uuid)
                                .levels
                                .reduce((a, b) => a + b.point, 0);
                            return summary > 0 ? summary : ''
                        }
                    },
                    {
                        title: 'Trung bình',
                        dataIndex: 'average_level',
                        fixed: 'right',
                        width: 100,
                        render: (_, loc) => {
                            let summary = levelLocs
                                .find(levelLoc => levelLoc.locUuid === loc.uuid)
                                .levels
                                .reduce((a, b) => a + b.point, 0);
                            let num = levelLocs.find(levelLoc => levelLoc.locUuid === loc.uuid).levels.length;
                            return summary > 0 && num > 0 ? (summary) / (num) : ''

                        }
                    }
                ]
            )
    )

    return useMemo(() => {
        return <>
            <Table
                columns={columns}
                bordered
                pagination={false}
                dataSource={
                    trainingItem.learning_outcomes.map((loc, index) => {
                        loc.key = index;
                        return loc;
                    })
                }
                scroll={{x: 1500, y: 2500}}
            />
        </>
    }, [])
}

const MatrixCourses = ({trainingItem}) => {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            width: 100
        },
        {
            title: 'Mã học phần',
            dataIndex: 'course_code',
            width: 250
        },
        {
            title: 'Tên học phần',
            dataIndex: 'course_name_vi'
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'credits'
        },
        {
            title: 'Loại học phần',
            dataIndex: ['training_program_course', 'course_type'],
            render: (_, course) => {
                switch (course.training_program_course.course_type) {
                    case 'B':
                        return "Bắt buộc"
                    case 'L':
                        return "Tự chọn"
                    case 'BT':
                        return "Bổ trợ"
                    case 'TACS':
                        return "Tiếng Anh cơ sở"
                }
            }
        }
    ]
    return (
        <>
            <Table
                columns={columns}
                bordered
                pagination={false}
                dataSource={
                    trainingItem.courses.map((course, index) => {
                        course.key = course.uuid;
                        course.stt = index+1;
                        return course;
                    })
                }
                scroll={{y: 500}}
            />
        </>
    )
}

const TrainingProgramItem = ({item, userRole, vnNameSearch}) => {
    const [visibleCourseList, setVisibleCourseList] = useState(false);
    const [visibleLocMatrix, setVisibleLocMatrix] = useState(false);
    const [visibleCourseMatrix, setVisibleCourseMatrix] = useState(false);
    const dispatch = useDispatch();

    let levelLocs = item.learning_outcomes.map(loc => ({
        locUuid: loc.uuid,
        levels: []
    }))

    const onLock = async (uuid) => {
        let course_outlines = [];
        for(let course of item.courses) {
            course_outlines.push({
                courseUuid: course.uuid,
                outlineUuid: course.outlines[0] ? course.outlines[0].uuid : null
            })
        }
        try {
            await axios.put(`/training-programs/${uuid}/lock`, {
                course_outlines
            })
            message.success("Đã khóa chương trình đào tạo");
            dispatch(actions.getAllTrainingProgram({vnNameSearch: ""}));
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }

    const onUnLock = async (uuid) => {
        let course_outlines = [];
        for(let course of item.courses) {
            course_outlines.push({
                courseUuid: course.uuid,
                outlineUuid: course.outlines[0] ? course.outlines[0].uuid : null
            })
        }
        try {
            await axios.put(`/training-programs/${uuid}/unlock`, {
                course_outlines
            })
            message.success("Đã mở khóa chương trình đào tạo");
            dispatch(actions.getAllTrainingProgram({vnNameSearch: ""}));
        } catch (e) {
            message.error("Đã có lỗi xảy ra")
        }
    }

    const onDeleteTrainingProgram = (uuid) => {
        axios.delete(`/training-programs/${uuid}`)
            .then(res => {
                message.success("Đã xóa chương trình đào tạo")
                dispatch(actions.getAllTrainingProgram({
                    vnNameSearch
                }));
            })
            .catch(e => {
                message.error("Không thể xóa chương trình đào tạo")
            })
    }

    const actionAdmin = [
        <Link to={`/uet/training-programs/updating/${item.uuid}`}>
            <EditOutlined key="edit"/>
        </Link>,

        <BuildOutlined onClick={() => setVisibleLocMatrix(true)}/>,
        <InsertRowBelowOutlined onClick={() => setVisibleCourseMatrix(true)}/>,

            !item.lock_edit ?
                <Popconfirm
                    title="Sau khi khóa sẽ không thể chỉnh sửa?"
                    cancelText="Hủy"
                    okText="Khóa"
                    onConfirm={() => onLock(item.uuid)}
                >
                    <UnlockOutlined/>
                </Popconfirm>
                :
                <Popconfirm
                    title="Mở khóa chương trình đào tạo này?"
                    cancelText="Hủy"
                    okText="Mở khóa"
                    onConfirm={() => onUnLock(item.uuid)}
                >
                    <LockOutlined/>
                </Popconfirm>,

        <Popconfirm
            title="Xóa CTĐT?"
            cancelText="Hủy"
            okText="Xóa"
            onConfirm={() => onDeleteTrainingProgram(item.uuid)}
        >
            <DeleteOutlined/>
        </Popconfirm>,
        ,
    ];

    const actionStudent = [
        <Icon
            component={() => <i className="fas fa-th-list"/>}
            key="setting"
            onClick={() => {
                setVisibleCourseList(true)
            }}
        />,
    ];


    return (
        <>
            <Card
                extra={
                    <Link to={`/uet/training-programs/${item.uuid}`}>
                        <Button type="primary" shape="circle" icon={<InfoOutlined/>} size="small"/>
                    </Link>
                }
                actions={
                    userRole == 0 ? actionAdmin : (userRole == 3 ? actionStudent : "")
                }
                title={item.vn_name}
                hoverable
            >
                <Descriptions column={1} style={{height: '200px'}}>
                    <Descriptions.Item label="Ngành đào tạo">
                        {
                            item.vn_name ? item.vn_name : ''
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Số học phần">
                        {
                            item.courses.length
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lớp đang áp dụng">
                        {
                            item.classes ? JSON.parse(item.classes).length : 0
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {
                            item.lock_edit ? "Đã khóa" : "Mở"
                        }
                    </Descriptions.Item>

                </Descriptions>
            </Card>
            <ListCourseOfTraining
                visibleCourseList={visibleCourseList}
                setVisibleCourseList={setVisibleCourseList}
                trainingItem={item}
            />


            <Modal
                visible={visibleLocMatrix}
                title={`Ma trận chuẩn đầu ra chương trình đào tạo: ${item.vn_name}`}
                okText="OK"
                className="modal-locs"
                onCancel={() => {
                    setVisibleLocMatrix(false);
                }}
                onOk={() => {
                    setVisibleLocMatrix(false);
                }}
                footer={null}
            >
                <MatrixLearningOutcomes trainingItem={item} levelLocs={levelLocs}/>
            </Modal>

            <Modal
                visible={visibleCourseMatrix}
                title={`Ma trận học phần chương trình đào tạo: ${item.vn_name}`}
                okText="OK"
                className="modal-courses"
                onCancel={() => {
                    setVisibleCourseMatrix(false);
                }}
                onOk={() => {
                    setVisibleCourseMatrix(false);
                }}
                footer={null}
            >
                <MatrixCourses trainingItem={item} />
            </Modal>
        </>
    )
}

export default TrainingProgramItem;