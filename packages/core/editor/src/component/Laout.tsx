import React, {Fragment, useEffect} from "react";
import {useViewer} from "../store/useStore.ts";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import SceneView from "./SceneView.tsx";
import SceneTree from "./SceneTree.tsx";
import AttributePane from "./AttributePane.tsx";

const Layout: React.FC = () => {
    const viewer = useViewer()
    useEffect(() => {
    }, [viewer])

    const onResize = () => {
        // console.log("--")
        // if (viewer){
        //     viewer.setSize()
        // }
    }
    const onLayout = () => {
        if (viewer) {
            viewer.setSize()
        }
    }
    return (
        <Fragment>
            <PanelGroup
                style={{height: "calc(100% - 32px)"}}
                direction="horizontal"
                onLayout={onLayout}
            >
                <Panel defaultSize={70}
                    // style={{background: "#e0f194"}}
                       className={"ResizeHandle"}>
                    <PanelGroup direction="horizontal" onLayout={onLayout}>
                        {/*<Panel defaultSize={40}*/}
                        {/*>*/}
                        {/*    <FilePane/>*/}
                        {/*</Panel>*/}
                        {/*<PanelResizeHandle className={"ResizeHandle"}/>*/}
                        <Panel defaultSize={60}>
                            <SceneView/>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className={"ResizeHandle"}/>
                <Panel defaultSize={20}>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={30}>
                            <SceneTree/>
                        </Panel>
                        <PanelResizeHandle className={"ResizeHandle"}/>
                        <Panel defaultSize={70}>
                            <AttributePane/>
                        </Panel>
                    </PanelGroup>
                </Panel>
            </PanelGroup>
        </Fragment>
    )
}

export default Layout;
