import React, {Fragment, useEffect, useMemo} from "react";
import {useSelectObject3D, useViewer} from "../../store/useStore.ts";
import {Button, Descriptions, Form, FormProps} from "antd";
import {FieldData} from "rc-field-form/lib/interface";
import * as THREE from "three";
import {isMesh} from "three-is";
import useScene from "../../store/useScene.ts";
import useEditor from "../../store/useEditoruseEditor.ts";
import {ObjectAttributeProvider, TextItem} from "@plum-render/common-ui";


const GeometryAttribute: React.FC = () => {
    const [geometryForm] = Form.useForm();
    const viewer = useViewer()
    const scene = useScene()
    const editor = useEditor()
    const selectObject3D = useSelectObject3D()

    useEffect(() => {

    }, [viewer])

    const onFieldsChange: FormProps['onFieldsChange'] = (changedFields: FieldData[], allFields: FieldData[]) => {
        const changedField = changedFields[0];
        // console.log(changedField)
        const names = changedField.name;
        const value = changedField.value;
        const name = names[0]
        console.log(name, value)
    }
    const geometry = useMemo(() => {
        if (isMesh(selectObject3D)) {
            return selectObject3D.geometry
        }
        return undefined
    }, [selectObject3D]);
    // const fogDensity = Form.useWatch('fogDensity', geometryForm);

    let nameMap = new Map([['position', "位置"], ['normal', "法线"], ['uv', "uv"], ['tangent', "4"]]);

    const items = useMemo(() => {
        let list = []
        if (geometry) {
            if (geometry.index !== null) {
                list.push({
                    key: '0',
                    label: '索引',
                    children: geometry.index.count,
                })
            }
            const attributes = geometry.attributes;
            for (const name in attributes) {
                const attribute = attributes[name];
                console.log(name)

                let {count, itemSize} = attribute

                list.push({
                    key: nameMap.get(name),
                    label: nameMap.get(name),
                    children: `${count}(${count / itemSize}*${itemSize})`,
                })
            }

        }
        return list
    }, [geometry])
    const onExporter = () => {

    }
    return (
        <Fragment>
            <div className={"scrollable-div"}>
                {
                    geometry ?
                        <Form
                            form={geometryForm}
                            onFieldsChange={onFieldsChange}
                            name="GeometryAttribute"
                            labelAlign="right"
                            labelCol={{span: 6}}
                            // colon={false}
                        >
                            <ObjectAttributeProvider value={{object: geometry}}>
                                <TextItem label="类型" name="type"/>
                                <TextItem label="唯一标识" name="uuid"/>
                                <TextItem label="名称" name="name"/>
                                <Descriptions title="属性" items={items}/>
                            </ObjectAttributeProvider>
                            <Form.Item style={{marginTop: "10px"}}>
                                <Button color="primary" variant="text" onClick={() => {
                                    geometry.computeVertexNormals();
                                }}>
                                    计算顶点法线
                                </Button>
                                <Button color="primary" variant="text" onClick={() => {
                                    editor?.showNormals(selectObject3D as THREE.Object3D);
                                }}>
                                    显示顶点法线
                                </Button>
                                <Button type="link" htmlType="button" onClick={onExporter}>
                                    导出json
                                </Button>
                            </Form.Item>
                        </Form> : null
                }
            </div>
        </Fragment>
    )
}

export default GeometryAttribute;
