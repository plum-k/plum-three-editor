import React, {Fragment, useEffect, useState} from "react";
import {Button, Empty, Form, Select} from "antd";
import * as THREE from "three";
import {useSelectKey, useSelectObject3D, useViewer} from "../../store/useStore.ts";
import {
    BoolItem,
    ColorItem,
    JsonItem,
    InputNumberItem,
    ObjectAttributeProvider,
    TextItem,
    Vector3Item
} from "@plum-render/common-ui";
import {SelectProps} from "rc-select/lib/Select";
import {DownloadOutlined} from "@ant-design/icons";


const ObjectAttribute: React.FC = () => {
    const viewer = useViewer()
    const selectObject3D = useSelectObject3D()
    const selectKey = useSelectKey();
    const [isSet, set] = useState<any>(false);
    const [animationsList, setAnimationsList] = React.useState<Array<THREE.AnimationClip>>([])
    useEffect(() => {
        if (viewer) {
            viewer.editor.editorEventManager.objectChanged.subscribe((object) => {
                update(object);
            })
        }

    }, [viewer])

    const update = (object: THREE.Object3D, isInit: boolean = false) => {
        if (isInit) {
            const animations = object.animations;
            if (animations.length > 0) {
                setAnimationsList(animations);
            } else {
                setAnimationsList([]);
            }
        }
    }

    useEffect(() => {
        if (selectObject3D) {
            update(selectObject3D, true)
        }
    }, [selectObject3D])

    const [form] = Form.useForm();
    // const type = Form.useWatch('type', form);
    // const uuid = Form.useWatch('uuid', form);
    // useSyncFormValue(form, ["name"], selectObject3D)
    // useSyncFormValue(form, ['position', 'x'], selectObject3D)
    // useSyncFormValue(form, ['position', 'y'], selectObject3D)
    // useSyncFormValue(form, ['position', 'z'], selectObject3D)
    // useSyncFormValue(form, ['castShadow', 'z'], selectObject3D)
    // useSyncFormValue(form, ['receiveShadow', 'z'], selectObject3D)
    // useSyncFormValue(form, ['visible'], selectObject3D)

    const play = (item: THREE.AnimationClip) => {
        if (viewer) {
            const action = viewer.animationMixer.clipAction(item, selectObject3D);
            action.isRunning() ? action.stop() : action.play();
        }
    }

    const onFieldsChange: FormProps['onFieldsChange'] = (changedFields, allFields) => {
        const changedField = changedFields[0];
        const names = changedField.name;
        const value = changedField.value;
        // console.log(name,value)
        if (selectObject3D) {
            // console.log(names)
            // console.log(value)
            if (["rotation"].includes(names[0])) {
                viewer?.editor.setValueExecute(selectObject3D, names, THREE.MathUtils.degToRad(value));
            } else {
                viewer?.editor.setValueExecute(selectObject3D, names, value);
            }
            if (["position", "rotation", "scale"].includes(names[0])) {
                viewer?.eventManager.selectObjectChanged.next(selectObject3D);
            }
        }
    }

    const onExporter = () => {

    }
    const [selectedValue, setSelectedValue] = useState({value: 'json', label: 'json'});

    const handleChange: SelectProps["onChange"] = (value) => {
        console.log('Selected value:', value); // 输出选择的值
        setSelectedValue(value);
    };
    return (
        <Fragment>
            <div className={"scrollable-div"}>
                {
                    selectObject3D ?
                        <Form
                            onFieldsChange={onFieldsChange}
                            form={form}
                            name="Attribute"
                            labelAlign="right"
                            labelCol={{span: 6}}
                        >
                            <ObjectAttributeProvider value={{object: selectObject3D}}>
                                <TextItem label="类型" name="type"/>
                                <TextItem label="唯一标识" name="uuid"/>
                                <TextItem label="名称" name="name"/>
                                <Vector3Item label="位置" basePropertyName="position"/>
                                <Vector3Item label="旋转" basePropertyName="rotation" convertData={(value) => ({
                                    x: THREE.MathUtils.radToDeg(value.x),
                                    y: THREE.MathUtils.radToDeg(value.y),
                                    z: THREE.MathUtils.radToDeg(value.z)
                                })}/>
                                <Vector3Item label="缩放" basePropertyName="scale"/>
                                <InputNumberItem label="强度" name="intensity"/>
                                <ColorItem label="颜色" name="color"/>
                                <BoolItem label="可见性" name="visible"/>
                                <InputNumberItem label="阴影强度" name={["shadow", "intensity"]}/>
                                <InputNumberItem label="阴影偏移" name={["shadow", "bias"]}/>
                                <InputNumberItem label="阴影法线偏移" name={["shadow", "normalBias"]}/>
                                <InputNumberItem label="阴影半径" name={["shadow", "radius"]}/>
                                <ColorItem label="基色" name="groundcolor"/>
                                <InputNumberItem label="距离" name="distance"/>
                                <InputNumberItem label="角度" name="angle"/>
                                <InputNumberItem label="边缘" name="penumbra"/>
                                <InputNumberItem label="衰减" name="decay"/>
                                <BoolItem label="接收阴影" name="receiveShadow"/>
                                <BoolItem label="产生阴影" name="castShadow"/>
                                <BoolItem label="视锥体裁剪" name="frustumCulled"/>
                                <InputNumberItem label="渲染次序" name="renderOrder"/>
                                <JsonItem label="自定义数据" name="userData"/>
                            </ObjectAttributeProvider>
                            <Form.Item label="导出">
                                <Select onChange={handleChange} defaultValue={"json"}
                                        options={[{value: 'json', label: 'json'}, {
                                            value: 'drc',
                                            label: 'drc'
                                        }, {value: 'glb', label: 'glb'}, {value: 'gltf', label: 'gltf'}, {
                                            value: 'obj',
                                            label: 'obj'
                                        }, {value: 'ply', label: 'ply'}, {value: 'stl', label: 'stl'},]}
                                        style={{width: "100px",}}/>
                                <Button type="primary" icon={<DownloadOutlined/>} onClick={onExporter}/>
                            </Form.Item>
                            {/*{*/}
                            {/*    animationsList.length > 0 ?*/}
                            {/*        <Form.Item<ObjectAttributeFieldType>*/}
                            {/*            label="动画"*/}
                            {/*        >*/}
                            {/*            {*/}
                            {/*                animationsList.map((item, index) => {*/}
                            {/*                    return <div key={index}>*/}
                            {/*                        {item.name}*/}
                            {/*                        <Button type="link" onClick={() => play(item)}>播放</Button>*/}
                            {/*                    </div>*/}
                            {/*                })*/}
                            {/*            }*/}
                            {/*        </Form.Item> : null*/}
                            {/*}*/}
                        </Form>
                        : <Empty>
                            未选择对象
                        </Empty>
                }
            </div>
        </Fragment>
    )
}

export default ObjectAttribute;
