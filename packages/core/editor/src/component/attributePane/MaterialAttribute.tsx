import React, {Fragment, useEffect, useMemo, useState} from "react";
import {useSelectKey, useSelectObject3D, useViewer} from "../../store/useStore.ts";
import {
    isMesh,
    isMeshPhongMaterial,
    isMeshPhysicalMaterial,
    isMeshStandardMaterial,
    isMeshToonMaterial,
    isPointsMaterial
} from "three-is";
import {isArray, isNil} from "lodash-es";
import {Button, Collapse, CollapseProps, Empty, Form} from "antd";

import * as THREE from "three";
import {FieldData} from "rc-field-form/lib/interface";
import {
    BoolItem,
    ColorItem,
    InputNumberItem, NumberSliderItem,
    ObjectAttributeProvider,
    SelectItem,
    TextItem,
    TextureAttributeItem,
    Vector2Item
} from "@plum-render/common-ui";

const materialClasses: Record<string, any> = {
    'LineBasicMaterial': THREE.LineBasicMaterial,
    'LineDashedMaterial': THREE.LineDashedMaterial,
    'MeshBasicMaterial': THREE.MeshBasicMaterial,
    'MeshDepthMaterial': THREE.MeshDepthMaterial,
    'MeshNormalMaterial': THREE.MeshNormalMaterial,
    'MeshLambertMaterial': THREE.MeshLambertMaterial,
    'MeshMatcapMaterial': THREE.MeshMatcapMaterial,
    'MeshPhongMaterial': THREE.MeshPhongMaterial,
    'MeshToonMaterial': THREE.MeshToonMaterial,
    'MeshStandardMaterial': THREE.MeshStandardMaterial,
    'MeshPhysicalMaterial': THREE.MeshPhysicalMaterial,
    'RawShaderMaterial': THREE.RawShaderMaterial,
    'ShaderMaterial': THREE.ShaderMaterial,
    'ShadowMaterial': THREE.ShadowMaterial,
    'SpriteMaterial': THREE.SpriteMaterial,
    'PointsMaterial': THREE.PointsMaterial
};
const MaterialAttribute: React.FC = () => {
    const viewer = useViewer()
    const selectObject3D = useSelectObject3D()
    const selectKey = useSelectKey();
    const [materialList, setMaterialList] = useState<any[]>([]);
    const [selectMaterial, setSelectMaterial] = useState<any>({})
    const [form] = Form.useForm();
    useEffect(() => {
        if (selectObject3D) {
            if (isMesh(selectObject3D)) {
                // todo fbx 才有材质数组
                const material = selectObject3D.material;
                if (isArray(material)) {
                    setMaterialList(material)
                } else {
                    setMaterialList([material])
                }
            }
        }
    }, [selectObject3D])

    const updateMaterialUi = (material: THREE.Material) => {
        // const fields = getFields([...attributeInfoList], material);
        // console.log(fields)
        // setAttributeInfoList(fields);
        // form.setFields(fields)
    }

    useEffect(() => {
        if (materialList.length > 0) {
            const firstMaterial = materialList[0];
            setSelectMaterial(firstMaterial)
            updateMaterialUi(firstMaterial)
        }
    }, [materialList]);

    const onChangeComplete = () => {
        console.log("选择完成")
    }
    const onFieldsChange:FormProps['onFieldsChange'] = (changedFields: FieldData[], allFields: FieldData[]) => {
        const changedField = changedFields[0];
        // console.log(changedField)
        const names = changedField.name;
        const value = changedField.value;
        // console.log(name,value)
        const name = names[0];
        console.log(name)
        console.log(value)
        // console.log(selectObject3D)
        if (selectObject3D) {
            if (name === "color") {
                return
            }
            // if (type === "color") {
            //     viewer?.editor.setMaterialColorExecute(selectObject3D, name, value.toRgbString())
            // } else
            if (name === "type") {
                console.log("类型变化")
                console.log(value)
                const material = Reflect.construct(materialClasses[value], []) as THREE.Material;
                viewer?.editor.setMaterialExecute(selectObject3D, material)
                updateMaterialUi(material);
            } else {
                viewer?.editor.setMaterialValueExecute(selectObject3D, name, value);
            }
        }
    }

    const items = useMemo(() => {
        if (isNil(selectObject3D)) {
            return []
        }
        const material = selectObject3D?.material;
        const list: CollapseProps['items'] = [];
        const isShow = true
        const isMeshPhysicalMaterialType = isMeshPhysicalMaterial(material);
        const isMeshPhongMaterialType = isMeshPhongMaterial(material);
        const isPointsMaterialType = isPointsMaterial(material);
        const isMeshToonMaterialType = isMeshToonMaterial(material);
        const isMeshStandardMaterialType = isMeshStandardMaterial(material);

        // 动态添加 "混合"
        if (isShow) {
            list.push({
                key: '混合',
                label: '混合',
                children: <Fragment>
                    <BoolItem label="透明性" name="transparent"/>
                    <NumberSliderItem label="透明度" name="opacity" range={{min: 0, max: 1, step: 0.01}}/>
                    <BoolItem label="深度测试" name="depthtest"/>
                    <BoolItem label="深度缓冲" name="depthwrite"/>
                    <BoolItem label="线宽" name="wireframe"/>
                    <BoolItem label="雾影响" name="fog"/>
                    <SelectItem label="混合" name="blending" fieldProps={{
                        options: [{value: '0', label: 'No'}, {
                            value: '1',
                            label: 'Normal'
                        }, {value: '2', label: 'Additive'}, {value: '3', label: 'Subtractive'}, {
                            value: '4',
                            label: 'Multiply'
                        }, {value: '5', label: 'Custom'},],
                    }}/>
                    <NumberSliderItem label="α测试" name="alphaTest" range={{min: 0, max: 1, step: 0.01}}/>
                    <TextureAttributeItem label="透明贴图" name="alphaMap"/>
                </Fragment>
            });
        }

        // 动态添加 "粗糙/金属"
        if (isMeshStandardMaterialType) {
            list.push({
                key: '粗糙/金属',
                label: '粗糙/金属',
                children: <Fragment>
                    <NumberSliderItem label="粗糙度" name="roughness" range={{min: 0, max: 1}}/>
                    <TextureAttributeItem label="粗糙贴图" name="roughnessMap"/>
                    <NumberSliderItem label="金属度" name="metalness" range={{min: 0, max: 1}}/>
                    <TextureAttributeItem label="金属贴图" name="metalnessMap"/>
                </Fragment>
            });
        }

        // 动态添加 "环境/遮蔽/光照"
        if (isMeshStandardMaterialType) {
            list.push({
                key: '环境/遮蔽/光照',
                label: '环境/遮蔽/光照',
                children: <Fragment>
                    <TextureAttributeItem label="光照贴图" name="lightMap"/>
                    <InputNumberItem label="光照强度" name="lightMapIntensity"/>

                    <TextureAttributeItem label="环境光遮蔽贴图" name="aoMap"/>
                    <InputNumberItem label="环境光遮蔽贴图强度" name="aoMapIntensity"/>

                    <TextureAttributeItem label="环境贴图" name="envMap"/>
                    <InputNumberItem label="环境贴图强度" name="envMapIntensity"/>
                </Fragment>
            });
        }

        // 动态添加 "凹凸/置换/法线"
        if (isMeshStandardMaterialType) {
            list.push({
                key: '凹凸/置换/法线',
                label: '凹凸/置换/法线',
                children: <Fragment>
                    <TextureAttributeItem label="凹凸贴图" name="bumpMap"/>
                    <InputNumberItem label="凹凸缩放" name="bumpScale"/>
                    <TextureAttributeItem label="置换贴图" name="displacementMap"/>
                    <InputNumberItem label="置换缩放" name="displacementScale"/>
                    <TextureAttributeItem label="法线贴图" name="normalMap"/>
                    <Vector2Item basePropertyName="normalScale" label="法线影响缩放"/>
                </Fragment>
            });
        }

        // 动态添加 "自发光"
        if (isMeshStandardMaterialType) {
            list.push({
                key: '自发光',
                label: '自发光',
                children: <Fragment>
                    <ColorItem label="自发光颜色" name="emissive"/>
                    <TextureAttributeItem label="自发光贴图" name="emissiveMap"/>
                    <InputNumberItem label="自发光强度" name="emissiveIntensity"/>
                </Fragment>
            });
        }

        // 动态添加 "折射"
        if (isMeshPhysicalMaterialType) {
            list.push({
                key: '折射',
                label: '折射',
                children: <Fragment>
                    <NumberSliderItem label="折射率" name="ior" range={{min: 1, max: 2.333}}/>
                    <InputNumberItem label="折射率" name="ior"/>
                    <InputNumberItem label="透光率" name="transmission"/>
                    <TextureAttributeItem label="透光贴图" name="transmissionMap"/>
                    <InputNumberItem label="厚度" name="thickness"/>
                    <TextureAttributeItem label="厚度贴图" name="thicknessMap"/>
                    <ColorItem label="衰减色" name="attenuationColor"/>
                    <InputNumberItem label="衰减距离" name="attenuationDistance"/>
                </Fragment>
            });
        }

        // 动态添加 "清漆"
        if (isMeshPhysicalMaterialType) {
            list.push({
                key: '清漆',
                label: '清漆',
                children: <Fragment>
                    <NumberSliderItem label="折射率" name="ior" range={{min: 1, max: 2.333}}/>
                    <InputNumberItem label="折射率" name="ior"/>
                    <InputNumberItem label="透光率" name="transmission"/>
                    <TextureAttributeItem label="透光贴图" name="transmissionMap"/>
                    <InputNumberItem label="厚度" name="thickness"/>
                    <TextureAttributeItem label="厚度贴图" name="thicknessMap"/>
                    <ColorItem label="衰减色" name="attenuationColor"/>
                    <InputNumberItem label="衰减距离" name="attenuationDistance"/>
                </Fragment>
            });
        }

        // 动态添加 "各向异性"
        if (isMeshPhysicalMaterialType) {
            list.push({
                key: '各向异性',
                label: '各向异性',
                children: <Fragment>
                    <InputNumberItem label="各向异性" name="anisotropy"/>
                    <InputNumberItem label="各向异性旋转" name="anisotropyRotation"/>
                    <TextureAttributeItem label="各向异性贴图" name="anisotropyMap"/>
                </Fragment>
            });
        }

        // 动态添加 "彩虹"
        if (isMeshPhysicalMaterialType) {
            list.push({
                key: '彩虹',
                label: '彩虹',
                children: <Fragment>
                    <NumberSliderItem label="彩虹色强度" name="iridescence" range={{min: 0, max: 1}}/>
                    <NumberSliderItem label="彩虹色折射率" name="iridescenceIOR" range={{min: 1, max: 2.333}}/>
                    <TextureAttributeItem label="彩虹色贴图" name="iridescenceMap"/>
                    <Vector2Item basePropertyName="iridescenceThicknessRange" label="彩虹色厚度"/>
                    <TextureAttributeItem label="彩虹色厚度贴图" name="iridescenceThicknessMap"/>
                </Fragment>
            });
        }

        // 动态添加 "光泽"
        if (isMeshPhysicalMaterialType) {
            list.push({
                key: '光泽',
                label: '光泽',
                children: <Fragment>
                    <NumberSliderItem label="光泽强度" name="sheen" range={{min: 0, max: 1}}/>
                    <NumberSliderItem label="光泽粗糙度" name="sheenRoughness" range={{min: 0, max: 1}}/>
                    <TextureAttributeItem label="光泽粗糙度贴图" name="sheenRoughnessMap"/>
                    <ColorItem label="光泽颜色" name="sheenColor"/>
                    <TextureAttributeItem label="光泽颜色贴图" name="sheenColorMap"/>
                </Fragment>
            });
        }

        // 动态添加 "垂直高光"
        if (isMeshPhysicalMaterialType) {
            list.push({
                key: '高光',
                label: '高光',
                children: <Fragment>
                    <NumberSliderItem label="高光强度" name="specularIntensity" range={{min: 0, max: 1}}/>
                    <TextureAttributeItem label="高光强度贴图" name="specularIntensityMap"/>
                    <ColorItem label="高光颜色" name="specularColor"/>
                    <TextureAttributeItem label="高光颜色贴图" name="specularColorMap"/>
                </Fragment>
            });
        }

        // 动态添加 "高光"
        if (isMeshPhongMaterialType) {
            list.push({
                key: '高光',
                label: '高光',
                children: <Fragment>
                    <InputNumberItem label="高光" name="specular"/>
                    <TextureAttributeItem label="高光贴图" name="specularMap"/>
                    <NumberSliderItem label="高光大小" name="shininess" range={{min: 0, max: 100}}/>
                </Fragment>
            });
        }

        // 动态添加 "大小"
        if (isPointsMaterialType) {
            list.push({
                key: '大小',
                label: '大小',
                children: <Fragment>
                    <InputNumberItem label="大小" name="size"/>
                    <BoolItem label="大小衰减" name="sizeAttenuation"/>
                </Fragment>
            });
        }

        // 动态添加 "渲染"
        if (isShow) {
            list.push({
                key: '渲染',
                label: '渲染',
                children: <Fragment>
                    <SelectItem label="面" name="side" fieldProps={{
                        options: [{value: 0, label: '正面'}, {value: 1, label: '背面'}, {
                            value: 2,
                            label: '双面'
                        },]
                    }}/>
                    <BoolItem label="平面着色" name="flatShading"/>
                    <BoolItem label="预乘透明" name="premultipliedAlpha"/>
                    <InputNumberItem label="顶点色倍增" name="vertexColors"/>
                    <InputNumberItem label="可见性" name="visible"/>
                </Fragment>
            });
        }

        // 动态添加 "渲染"
        if (isShow) {
            list.push({
                key: '杂项',
                label: '杂项',
                children: <Fragment>
                    <InputNumberItem label="色散" name="dispersion"/>
                    <InputNumberItem label="深度包装" name="depthPacking"/>
                    <TextureAttributeItem label="材质捕获" name="matcap"/>
                    <TextureAttributeItem label="渐变贴图" name="gradientmap"/>
                    <NumberSliderItem label="反射率" name="reflectivity" range={{min: 0, max: 1}}/>
                    <NumberSliderItem label="折射率" name="refractionRatio" range={{min: 0, max: 1}}/>
                </Fragment>,
            },);
        }

        return list;
    }, [selectObject3D])
    const onExporter = () => {

    }
    return (
        <Fragment>
            <div className={"scrollable-div"}>
                {
                    selectObject3D?.material ?
                        <Form form={form} onFieldsChange={onFieldsChange} name="MaterialAttribute" labelAlign="right"
                              labelCol={{span: 6}}> <ObjectAttributeProvider value={{object:selectObject3D?.material}}>
                            <SelectItem label="类型" name="type" fieldProps={{
                                options: [{
                                    value: 'MeshBasicMaterial',
                                    label: '基本网格材质'
                                }, {value: 'MeshDepthMaterial', label: '深度网格材质'}, {
                                    value: 'MeshNormalMaterial',
                                    label: '法线网格材质'
                                }, {
                                    value: 'MeshLambertMaterial',
                                    label: '兰伯特网格材质'
                                }, {value: 'MeshMatcapMaterial', label: '贴图网格材质'}, {
                                    value: 'MeshPhongMaterial',
                                    label: '冯氏网格材质'
                                }, {value: 'MeshToonMaterial', label: '卡通网格材质'}, {
                                    value: 'MeshStandardMaterial',
                                    label: '标准网格材质'
                                }, {value: 'MeshPhysicalMaterial', label: '物理网格材质'}, {
                                    value: 'RawShaderMaterial',
                                    label: '原始着色器材质'
                                }, {value: 'ShaderMaterial', label: '着色器材质'}, {
                                    value: 'ShadowMaterial',
                                    label: '阴影材质'
                                },],
                            }}/>
                            <TextItem label="唯一标识" name="uuid"/>
                            <TextItem label="名称" name="name"/>
                            <ColorItem label="颜色" name="color"/>
                            <TextureAttributeItem label="贴图" name="map"/>
                            <Collapse items={items} bordered={false} defaultActiveKey={['1']}/>
                        </ObjectAttributeProvider> <Form.Item style={{marginTop: "10px"}}>
                            <Button type="link" htmlType="button" onClick={onExporter}> 导出json </Button>
                        </Form.Item> </Form> : <Empty> 未选择对象 </Empty>

                }
            </div>
        </Fragment>
    )
}

export default MaterialAttribute;
