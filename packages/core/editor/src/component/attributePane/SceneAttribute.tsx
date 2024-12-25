import React, {Fragment, useEffect, useMemo} from "react";
import {useViewer} from "../../store/useStore.ts";
import {ColorPicker, Form, FormProps, Select} from "antd";
import {FieldData} from "rc-field-form/lib/interface";
import * as THREE from "three";
import {isColor, isFog, isMeshBasicMaterial, isMeshNormalMaterial, isTexture} from "three-is";
import {AttributeImage, ColorItem, InputNumberItem, ObjectAttributeProvider, Vector3Item} from "@plum-render/common-ui";
import useScene from "../../store/useScene.ts";
import {ThreeTool} from @plum-render/three-sdk";
import TextureAsset from @plum-render/three-sdk/src/core/asset/TextureAsset.ts";
const overrideMaterialList = [
    {value: "无", label: '无'},
    {value: "法线", label: '法线'},
    {value: "描边", label: '描边'},
]
const backgroundTypeList = [
    {value: "无", label: '无'},
    {value: "颜色", label: '颜色'},
    {value: "贴图", label: '贴图'},
]

const envTypeList = [
    {value: "无", label: '无'},
    {value: "贴图", label: '贴图'},
    {value: "同步背景", label: '同步背景'},
]

const fogList = [
    {value: "无", label: '无'},
    {value: "雾", label: '雾'},
    {value: "指数雾", label: '指数雾'},
]


const SceneAttribute: React.FC = () => {
    const [sceneForm] = Form.useForm();
    const viewer = useViewer()
    //----------------- 设置类型的初始值 开始
    useEffect(() => {
        updateOverrideMaterial();
        updateBackgroundType();
        updateEnvironmentType();
        updateFogType();
    }, [viewer])
    const updateOverrideMaterial = () => {
        if (viewer) {
            const material = viewer.scene.overrideMaterial;
            if (material) {
                if (isMeshNormalMaterial(material)) {
                    sceneForm.setFieldValue("overrideMaterial", "法线");
                } else if (isMeshBasicMaterial(material)) {
                    sceneForm.setFieldValue("overrideMaterial", "描边");
                }
            } else {
                sceneForm.setFieldValue("overrideMaterial", "无");
            }
        }
    }
    const updateBackgroundType = () => {
        if (viewer) {
            const background = viewer.scene.background;
            if (background) {
                if (isColor(background)) {
                    sceneForm.setFieldValue("backgroundType", "颜色");
                } else if (isTexture(background)) {
                    sceneForm.setFieldValue("backgroundType", "贴图");
                }
            } else {
                sceneForm.setFieldValue("backgroundType", "无");
            }
        }
    }
    const updateEnvironmentType = () => {
        if (viewer) {
            const environment = viewer.scene.environment;
            if (environment) {
                if (isTexture(environment)) {
                    const value = ThreeTool.getBase64FromTexture(environment);
                    sceneForm.setFieldValue("environmentType", value);
                }
            } else {
                sceneForm.setFieldValue("environmentType", "无");
            }
        }
    }
    const updateFogType = () => {
        if (viewer) {
            const fog = viewer.scene.fog;
            sceneForm.setFieldValue("fogNear", 1);
            sceneForm.setFieldValue("fogFar", 1000);
            sceneForm.setFieldValue("fogDensity", 0.00025);

            if (fog) {
                if (isFog(fog)) {
                    sceneForm.setFieldValue("fogType", "雾");
                } else {
                    sceneForm.setFieldValue("fogType", "指数雾");
                }
            } else {
                sceneForm.setFieldValue("fogType", "无");
            }
        }
    }
    //----------------- 设置类型的初始值 结束

    const onFieldsChange: FormProps['onFieldsChange'] = (changedFields: FieldData[], allFields: FieldData[]) => {
        const changedField = changedFields[0];
        // console.log(changedField)
        const names = changedField.name;
        const value = changedField.value;
        const name = names[0]
        console.log(name, value)
        // debugger
        // console.log(name)
        if (name === "overrideMaterial") {
            switch (value) {
                case "无":
                    viewer!.scene.overrideMaterial = null;
                    break
                case "法线":
                    viewer!.scene.overrideMaterial = new THREE.MeshNormalMaterial();
                    break
                case "描边":
                    viewer!.scene.overrideMaterial = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true
                    });
                    break;
            }
        } else if (name === "backgroundType") {
            switch (value) {
                case "无":
                    viewer!.scene.background = null;
                    break
                // case "颜色":
                //     const color = sceneForm.getFieldValue("color");
                //     viewer!.scene.background = new THREE.Color(color);
                //     break`
                // case "贴图":
                //     viewer!.scene.background = new THREE.TextureLoader().load(value);
                //     break;
            }
        } else if (name === "backgroundImage") {
            if (value === "") {
                viewer!.scene.background = null;
            } else {
                viewer!.scene.background = new THREE.TextureLoader().load(value);
            }
        } else if (name === "environmentImage") {
            if (value === "") {
                viewer!.scene.environment = null;
            } else {
                if (value.length > 0) {
                    if (value.length === 1) {
                        let textureAsset = new TextureAsset({
                            file: value[0]
                        })
                        viewer!.assetManager.loadTexture(textureAsset).then((texture) => {
                            viewer!.scene.environment = texture;
                            viewer!.scene.environment.mapping = THREE.EquirectangularReflectionMapping;
                            console.log(viewer!.scene)
                        })
                    } else if (value.length === 6) {
                        viewer!.scene.environment = new THREE.CubeTextureLoader().load(value);
                    }
                }
            }
        } else if (name === "fogType") {
            console.log(value)
            switch (value) {
                case "无":
                    viewer!.scene.fog = null;
                    break;
                case "雾":
                    viewer!.scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
                    break;
                case "指数雾":
                    viewer!.scene.fog = new THREE.FogExp2(fogColor, fogDensity);
                    break;
            }
        }
    }

    const onOpenChange = (open: boolean) => {
        if (!open) {
            const color = sceneForm.getFieldValue("color");
            const backgroundType = sceneForm.getFieldValue("backgroundType");
            if (backgroundType === "颜色") {
                const _color = color.toHexString();
                viewer!.scene.background = new THREE.Color(_color);
            }
        }
    }
    const renderBackgroundType = () => {
        if (backgroundType === "颜色") {
            return <Form.Item label={"背景颜色"} name={"color"}>
                <ColorPicker onOpenChange={onOpenChange}/>
            </Form.Item>
        } else if (backgroundType === "贴图") {
            return <Form.Item label={"背景贴图"} name={"backgroundImage"}>
                <AttributeImage/>
            </Form.Item>
        }
        return <Fragment></Fragment>
    }


    const overrideMaterial = Form.useWatch('overrideMaterial', sceneForm);
    const backgroundType = Form.useWatch('backgroundType', sceneForm);
    const environmentType = Form.useWatch('environmentType', sceneForm);

    const fogType = Form.useWatch('fogType', sceneForm);
    const fogColor = Form.useWatch('fogColor', sceneForm);
    const fogNear = Form.useWatch('fogNear', sceneForm);
    const fogFar = Form.useWatch('fogFar', sceneForm);
    const fogDensity = Form.useWatch('fogDensity', sceneForm);


    const scene = useScene()

    // 环境同步背景
    useEffect(() => {
        if (scene && environmentType === "背景" && scene.background !== null && isTexture(scene.background)) {
            scene.environment = scene.background;
            scene.environment.mapping = THREE.EquirectangularReflectionMapping;
            scene.environmentRotation.y = scene.backgroundRotation.y;
        }
    }, [environmentType]);


    //----------------- 雾表单
    const [fogForm] = Form.useForm();
    const fog = useMemo(() => {
        return scene?.fog;
    }, [scene, fogType])

    const fogOnFieldsChange = (changedFields: FieldData[], allFields: FieldData[]) => {
        const changedField = changedFields[0];
        // console.log(changedField)
        const names = changedField.name;
        const value = changedField.value;
        const name = names[0]

    }

    return (
        <Fragment>
            <div className={"scrollable-div"}>
                <Form
                    form={sceneForm}
                    onFieldsChange={onFieldsChange}
                    name="SceneAttribute"
                    labelAlign="right"
                    labelCol={{span: 6}}
                    // colon={false}
                >
                    <ObjectAttributeProvider value={{object: scene}}>
                        <Form.Item label={"覆盖材质"} name={"overrideMaterial"}>
                            <Select options={overrideMaterialList}
                                    style={{width: "150px"}}/>
                        </Form.Item>
                        <Form.Item label={"背景类型"} name={"backgroundType"}>
                            <Select options={backgroundTypeList}
                                    style={{width: "150px"}}/>
                        </Form.Item>
                        {backgroundType ?
                            <Fragment>
                                {renderBackgroundType()}
                            </Fragment> :
                            null
                        }
                        <InputNumberItem label="背景模糊" name="backgroundBlurriness"/>
                        <InputNumberItem label="背景强度" name="backgroundIntensity"/>
                        <Vector3Item label="背景旋转" basePropertyName="backgroundRotation" convertData={(value) => ({
                            x: THREE.MathUtils.radToDeg(value.x),
                            y: THREE.MathUtils.radToDeg(value.y),
                            z: THREE.MathUtils.radToDeg(value.z)
                        })}/>
                        <Form.Item label={"环境类型"} name={"environmentType"}>
                            <Select options={envTypeList} style={{width: "150px"}}/>
                        </Form.Item>
                        <Form.Item label={"环境图"} name={"environmentImage"}>
                            <AttributeImage/>
                        </Form.Item>
                        <InputNumberItem label="环境强度" name="environmentIntensity"/>
                        <Vector3Item label="环境旋转" basePropertyName="environmentRotation" convertData={(value) => ({
                            x: THREE.MathUtils.radToDeg(value.x),
                            y: THREE.MathUtils.radToDeg(value.y),
                            z: THREE.MathUtils.radToDeg(value.z)
                        })}/>
                        <Form.Item label={"雾"} name={"fogType"}>
                            <Select options={fogList} style={{width: "150px"}}/>
                        </Form.Item>
                    </ObjectAttributeProvider>
                </Form>
                <Form
                    form={fogForm}
                    onFieldsChange={fogOnFieldsChange}
                    name="fogAttribute"
                    labelAlign="right"
                    labelCol={{span: 4}}
                    // colon={false}
                >
                    <ObjectAttributeProvider value={{object: fog}}>
                        <ColorItem label="雾颜色" name="color"/>
                        <InputNumberItem label="最小距离" name="near"/>
                        <InputNumberItem label="最大距离" name="far"/>
                        <InputNumberItem label="雾密度" name="density"/>
                    </ObjectAttributeProvider>
                </Form>
            </div>
        </Fragment>
    )
}

export default SceneAttribute;
