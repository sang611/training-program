import {useEffect, useRef, useState} from "react";
import {DagreGraph} from "@ant-design/charts";
import Title from "antd/lib/typography/Title";
import {Card, Col, Row} from "antd";
import {useSelector} from "react-redux";

const DependencyCourseGraph = () => {

    const [edges, setEdges] = useState([]);
    const [sourceData, setSourceData] = useState({});
    const {trainingProgram} = useSelector(state => state.trainingPrograms)


    useEffect(() => {
        if (trainingProgram) {
            if(trainingProgram.courses) {
                let edgeList = [];
                trainingProgram.courses.forEach(course => {
                    let requiredCourses = JSON.parse(course.required_course);
                    if (requiredCourses) {
                        requiredCourses.forEach((requiredCourse => {
                            edgeList.push({source: requiredCourse.uuid, target: course.uuid});
                        }))
                    }
                })
                setEdges(edgeList);
            }
        }
    }, [trainingProgram])

    useEffect(() => {
        if(trainingProgram)
            if(trainingProgram.courses)
            {
                setSourceData(
                    {
                        nodes: trainingProgram.courses.map((course, index) => {
                            return {
                                id: course.uuid,
                                label: course.course_name_vi
                            }
                        }),
                        edges: edges
                    }
                )
            }

    }, [edges])




    const [data, setData] = useState(sourceData);

    const [nodeStyle, setNodeStyle] = useState();
    const [nodeSize, setNodeSize] = useState();
    const [edgeStyle, setEdgeStyle] = useState();
    const [layoutCfg, setLayoutCfg] = useState();
    const [anchorPoints, setAnchorPoints] = useState();
    const [nodeType, setNodeType] = useState("rect");
    const [minimapCfg, setMinimapCfg] = useState({
        show: false,
    });
    const [behaviors, setBehaviors] = useState(['drag-canvas', 'zoom-canvas']);
    const [nodeLabelCfg, setNodeLabelCfg] = useState({
        style: {
            //fontSize: 40
        }
    });

    const ref = useRef();

    const destroyGraph = () => {
        ref.current.destroy();
    };

    const updateBehaviors = () => {
        if (behaviors.indexOf('drag-node') !== -1) {
            setBehaviors(['drag-canvas', 'zoom-canvas']);
        } else {
            setBehaviors(['drag-canvas', 'zoom-canvas', 'drag-node']);
        }
    };

    const handleEdgeClick = (item, graph) => {
        graph.setItemState(item, 'selected', true);
    };
    const handleNodeClick = (item, graph) => {
        graph.setItemState(item, 'selected', true);
    };

    const handleCanvasClick = (graph) => {
        const selectedEdges = graph.findAllByState('edge', 'selected');
        selectedEdges.forEach((edge) => {
            graph.setItemState(edge, 'selected', false);
        });
        const selectedNodes = graph.findAllByState('node', 'selected');
        selectedNodes.forEach((node) => {
            graph.setItemState(node, 'selected', false);
        });
    };
    const edgeStateStyles = {
        hover: {
            stroke: '#1890ff',
            lineWidth: 2,
        },
        selected: {
            stroke: '#f00',
            lineWidth: 3,
        },
    };
    const nodeStateStyles = {
        hover: {
            stroke: '#1890ff',
            lineWidth: 2,
        },
        selected: {
            stroke: '#f00',
            lineWidth: 3,
        },
    };


    return <>
        <Title level={4}>
            Phụ thuộc giữa các học phần (theo quan hệ học phần tiên quyết)
        </Title>
        <Row>
            <Col span={20}>
                <Card>
                    <DagreGraph
                        nodeStyle={nodeStyle}
                        nodeSize={nodeSize}
                        layout={layoutCfg}
                        nodeAnchorPoints={anchorPoints}
                        nodeType={nodeType}
                        nodeLabelCfg={nodeLabelCfg}
                        minimapCfg={minimapCfg}
                        behaviors={behaviors}
                        data={sourceData}
                        handleEdgeClick={handleEdgeClick}
                        handleCanvasClick={handleCanvasClick}
                        edgeStateStyles={edgeStateStyles}
                        nodeStateStyles={nodeStateStyles}
                        handleNodeClick={handleNodeClick}
                        graphId="dagreFirst"
                    />
                </Card>
            </Col>
        </Row>


    </>
}

export default DependencyCourseGraph;