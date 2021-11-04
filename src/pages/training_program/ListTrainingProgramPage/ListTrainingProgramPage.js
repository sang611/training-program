import {Button, Col, Divider, List, Radio, Row, Spin, Table} from "antd";
import React, {useEffect, useState} from 'react'
import {BlockOutlined, PlusOutlined, SlackOutlined, TableOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../redux/actions";
import './ListTrainingProgramPage.css'
import Search from "antd/lib/input/Search";
import Text from "antd/es/typography/Text";
import TrainingProgramItem from "./TrainingProgramItem";
import TableThemeList from "./TableThemeList";

const ListTrainingProgramPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {userRole, currentUser} = useSelector(state => state.auth);
    const {trainingPrograms, loadingAllTrainings, errors} = useSelector(state => state.trainingPrograms)

    const [vnNameSearch, setVnNameSearch] = useState("");
    const [themeType, setThemeType] = useState(1);


    useEffect(() => {
        dispatch(actions.getAllTrainingProgram({
            vn_name: vnNameSearch,
            //institutionUuid: currentUser.department
        }));
    }, [vnNameSearch])

    const ButtonActions = (
        <>
            <Button
                type="primary"
                shape="round"
                danger
                icon={<PlusOutlined/>}
                /*style={{
                    position: 'fixed',
                    right: 52,
                    bottom: 32
                }}*/
                onClick={() => {
                    history.push("/uet/training-programs/creation")
                }}
            >
                Thêm mới CTĐT
            </Button>
        </>
    )


    const ListTheme = (
        <List
            grid={{
                gutter: 30,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: userRole > 1 ? 4 : 3,
                xxl: 4,
            }}
            dataSource={trainingPrograms}
            renderItem={item => {
                return <List.Item>
                    <TrainingProgramItem
                        item={item}
                        userRole={userRole}
                        vnNameSearch={vnNameSearch}
                    />
                </List.Item>
            }

            }
        />
    )

    const renderByTheme = () => {
        if(themeType === 1) {
            return ListTheme;
        }
        else if(themeType === 2) {
            return <TableThemeList vnNameSearch={vnNameSearch}/>;
        }
    }

    const SlackLoading = () => {
        return <>
            <center>
                <Spin
                    indicator={
                        <SlackOutlined
                            style={{fontSize: '60px', marginTop: '100px'}}
                            spin
                        />
                    }
                    size="large"
                />
            </center>
        </>
    }

    return (
        !errors ?
            <>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Radio.Group
                            defaultValue={themeType}
                            buttonStyle="solid"
                            onChange = {(e) => setThemeType(e.target.value)}
                        >
                            <Radio.Button value={1}>
                                <BlockOutlined />
                            </Radio.Button>
                            <Radio.Button value={2}>
                                <TableOutlined />
                            </Radio.Button>

                        </Radio.Group>
                    </Col>
                    <Col span={10}>
                        <Search
                            placeholder="Tìm kiếm chương trình đào tạo"
                            enterButton
                            size="large"
                            onChange={(e) => setVnNameSearch(e.target.value)}
                        />
                    </Col>
                </Row>
                <Divider orientation="left">
                    <Text type="danger">
                        <i>
                            {`${trainingPrograms.length} chương trình đào tạo`}
                        </i>
                    </Text>
                </Divider>
                <Row justify="end">
                    {userRole < 2 ? ButtonActions : ""}
                </Row>
                <br/>
                {
                    loadingAllTrainings === false ? renderByTheme() : <SlackLoading />
                }


            </> : <div>{errors.toString()}</div>
    )

}

export default ListTrainingProgramPage;
