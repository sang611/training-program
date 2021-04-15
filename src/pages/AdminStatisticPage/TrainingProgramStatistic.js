import {Card, Col, Row, Table} from "antd";
import Title from "antd/lib/typography/Title";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import * as actions from "../../redux/actions";
import style from './AdminStatisticPage.css'
import {AuditOutlined, LockOutlined} from "@ant-design/icons";


function TrainingProgramStatistic() {
    const dispatch = useDispatch();
    const {trainingPrograms, loadingAllTrainings, errors} = useSelector(state => state.trainingPrograms)

    const classes = [
        "A-E", "C-A-C", "C-A-CLC1", "C-A-CLC2", "C-A-CLC3", "C-B",
        "C-C", "C-CLC", "C-D", "C-E", "C-F", "C-G", "C-H", "C-K",
        "C-L", "C-J", "N", "T", "Đ-A-CLC", "Đ-B", "K", "E", "V", "H",
        "M1", "M2", "M3", "M4", "XD-GT"
    ];

    useEffect(() => {
        dispatch(actions.getAllTrainingProgram());
    }, [])

    const creditColumns = [
        {
            title: 'STT',
            dataIndex: 'stt'
        },
        {
            title: "Chương trình đào tạo",
            dataIndex: 'vn_name'
        },

        {
            title: "Tổng tín chỉ",
            render: (_, item) => {
                return JSON.parse(item.require_summary).total
            }
        }
    ]

    const classColumns = [
        {
            title: 'STT',
            dataIndex: 'stt'
        },
        {
            title: "Lớp",
            dataIndex: 'name'
        },

        {
            title: "Chương trình áp dụng",
            render: (_, cl) => {
                for (let trainingItem of trainingPrograms) {

                    if (JSON.parse(trainingItem.classes).includes(cl.name) == true) {
                        return trainingItem.vn_name;
                    }
                }
            }
        }
    ]


    return (
        <>
            <Card bodyStyle={{backgroundColor: '#E6F7FF'}} style={style.statisticInfo}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card bodyStyle={{backgroundColor: '#2db7f5'}} className="statistic-info">
                            <center>
                                <Title level={1}>
                                    {trainingPrograms.length}&nbsp;
                                    <AuditOutlined />
                                </Title>
                                <Title level={3}>CHƯƠNG TRÌNH ĐÀO TẠO</Title>
                            </center>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bodyStyle={{backgroundColor: '#108ee9'}}  className="statistic-info">
                            <center>
                                <Title level={1}>
                                    {
                                        trainingPrograms
                                            .filter(trainingItem => trainingItem.lock_edit)
                                            .length
                                    }&nbsp;
                                    <LockOutlined />
                                </Title>
                                <Title level={3}>CHƯƠNG TRÌNH ĐÀO TẠO ĐÃ KHÓA</Title>
                            </center>
                        </Card>
                    </Col>

                    <Col span={24}>
                        <Table
                            columns={creditColumns}
                            dataSource={
                                trainingPrograms.map((training, index) => {
                                    training.stt = index + 1;
                                    training.key = training.uuid;
                                    return training
                                })
                            }
                            pagination={false}
                            bordered
                            style={{width: '100%'}}
                        />
                    </Col>

                    <Col span={24}>
                        <Table
                            columns={classColumns}
                            dataSource={
                                classes.map((cl, index) => {
                                    return {
                                        name: cl,
                                        key: index,
                                        stt: index + 1
                                    }
                                })
                            }
                            pagination={{pageSize: 5}}
                            bordered
                            style={{width: '100%'}}
                        />
                    </Col>

                </Row>
            </Card>
        </>
    )
}

export default TrainingProgramStatistic
