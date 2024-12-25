import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useViewer} from "../../store/useStore.ts";
import {Popover} from "antd/lib/index";
import {FloatButton, Form} from "antd";
import {InputNumberItem, ObjectAttributeProvider} from "@plum-render/common-ui";
import {CameraOutlined} from "@ant-design/icons";

const SidePane: React.FC = () => {
    const viewer = useViewer()

    useEffect(() => {
    }, [viewer])
    //------------------- 相机表单-----------------
    const [cameraForm] = Form.useForm();
    const cameraOnFieldsChange = (changedFields, allFields) => {
        const changedField = changedFields[0];
        const names = changedField.name;
        const value = changedField.value;
        // console.log(name,value)
        if (cameraControls) {
            Reflect.set(camera, names, value);
            camera.updateProjectionMatrix();
        }
    }
    let camera = useMemo(() => {
        if (viewer) {
            return viewer.threeCameraControls.camera;
        }
        return null;
    }, [viewer])
    const CameraForm = () => {
        return (
            <Form
                form={cameraForm}
                onFieldsChange={cameraOnFieldsChange}
                name="controlsForm"
                labelAlign="right"
            >
                <ObjectAttributeProvider value={{object:camera}}>
                    <InputNumberItem itemProps={{label: "视野", name: "fov"}}/>
                    <InputNumberItem itemProps={{label: "近裁剪平面", name: "near"}}/>
                    <InputNumberItem itemProps={{label: "远裁剪平面", name: "far"}}/>
                </ObjectAttributeProvider>
            </Form>
        )
    }
    //------------------- 相机表单-----------------


    //------------------- 控制器表单-----------------
    const [controlsForm] = Form.useForm();
    const ControlsOnFieldsChange = (changedFields, allFields) => {
        const changedField = changedFields[0];
        const names = changedField.name;
        const value = changedField.value;
        // console.log(name,value)
        if (cameraControls) {
            Reflect.set(cameraControls, names, value);
        }
    }
    let cameraControls = useMemo(() => {
        if (viewer) {
            return viewer.threeCameraControls.cameraControls;
        }
        return null;
    }, [viewer])

    // 视野
    const ControlsForm = () => {
        return (
            <Form
                form={controlsForm}
                onFieldsChange={ControlsOnFieldsChange}
                name="controlsForm"
                labelAlign="right"
            >
                <ObjectAttributeProvider value={{object:cameraControls}}>
                    <InputNumberItem itemProps={{label: "最小距离", name: "minDistance"}}/>
                    <InputNumberItem itemProps={{label: "最大距离", name: "maxDistance"}}/>
                    <InputNumberItem itemProps={{label: "最小旋转", name: "minAzimuthAngle"}}/>
                    <InputNumberItem itemProps={{label: "最大旋转", name: "maxAzimuthAngle"}}/>
                    <InputNumberItem itemProps={{label: "最小俯仰", name: "minPolarAngle"}}/>
                    <InputNumberItem itemProps={{label: "最大俯仰", name: "maxPolarAngle"}}/>
                </ObjectAttributeProvider>
            </Form>
        )
    }
    //------------------- 控制器表单-----------------
    const PopoverContent = () => {
        return (
            <Fragment>
                <CameraForm/>
                <ControlsForm/>
            </Fragment>
        )
    }

    const [open, setOpen] = useState(true);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    return (
        <Fragment>
            <Popover content={PopoverContent}
                     title="相机设置"
                     onOpenChange={handleOpenChange}
            >
                <FloatButton icon={<CameraOutlined/>} style={{position: "absolute", top: 20, right: 20}}
                             onClick={() => {
                                 console.log('onClick')
                             }}/>
            </Popover>
        </Fragment>
    )
}

export default SidePane;
