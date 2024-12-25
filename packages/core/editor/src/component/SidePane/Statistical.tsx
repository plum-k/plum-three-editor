import React, {Fragment, useEffect, useState} from "react";
import {useViewer} from "../../store/useStore.ts";
import {Col, Row} from "antd";
import {getStatistics} from @plum-render/three-sdk";
import {throttleTime} from "rxjs";

const Statistical: React.FC = () => {
    const viewer = useViewer()

    let [info, setInfo] = useState<any>({
        objects: 0,
        vertices: 0,
        triangles: 0,
    });

    let [frameTime, setFrameTime] = useState<any>(0);
    useEffect(() => {
        if (viewer) {
            viewer.editor.editorEventManager.sceneGraphChanged.subscribe(() => {
                let statistics = getStatistics(viewer.scene)
                setInfo(statistics)
            })
            viewer.loop.sceneRendered.pipe(throttleTime(1000)).subscribe((value) => {
                setFrameTime(value)
            })
        }
    }, [viewer])


    return (
        <Fragment>
            <div className={"statistical"}>
                <Row>
                    <Col span={12}>物体</Col>
                    <Col span={12}>{info.objects}</Col>
                </Row>
                <Row>
                    <Col span={12}>顶点</Col>
                    <Col span={12}>{info.vertices}</Col>
                </Row>
                <Row>
                    <Col span={12}>三角形</Col>
                    <Col span={12}>{info.triangles}</Col>
                </Row>
                <Row>
                    <Col span={12}>渲染时间</Col>
                    <Col span={12}>{frameTime.toFixed(1)}</Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default Statistical;
