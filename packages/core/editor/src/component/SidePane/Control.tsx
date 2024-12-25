import React, {Fragment, useEffect, useState} from "react";
import {useViewer} from "../../store/useStore.ts";
import {ArrowsAltOutlined, FullscreenOutlined, RedoOutlined} from "@ant-design/icons";
import {Segmented} from "antd";

interface IconContainerProps {
    mode: string
    $select: string
}

const Control: React.FC = () => {
    const viewer = useViewer()
    useEffect(() => {
    }, [viewer])
    const [mode, setMode] = useState("translate")

    const handleClick = (mode: string) => {
        if (viewer) {
            setMode(mode)
            viewer.editor.transformControlsWarp.transformControls.setMode(mode);
        }
    }

    return (
        <Fragment>
            <div style={{
                zIndex: 9999,
                position: "absolute",
                top: "20px",
                left: "10px",
            }}>
                <Segmented
                    vertical
                    size={'large'}
                    options={[
                        {value: 'translate', icon: <FullscreenOutlined/>},
                        {value: 'rotate', icon: <RedoOutlined/>},
                        {value: 'Kanban', icon: <ArrowsAltOutlined/>},
                    ]}
                    onChange={handleClick}

                />
            </div>
        </Fragment>
    )
}

export default Control;
