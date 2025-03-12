<script lang="ts" setup>
import {ElForm} from "element-plus";
import {BoolItem, ColorItem, InputItem, InputNumberItem, SelectItem, TextItem, Vector2Item} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";
import {blendingOptions, sideOptions} from "./selectOptions.ts";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {useMaterialAttributeProvide} from "../../../hooks/useMaterialAttributeProvide.ts";
import UserDataItem from "../../../common-ui/attributeItem/UserDataItem.vue";

const {objectAttributeChangeSubject, toggle, updateTrigger} = useMaterialAttributeProvide({
  isAutoUpdate: false,
})
const {} = useBindSubscribe({
  fun: toggle,
  isMounted: true,
  isBindCallFun: true,
})

</script>

<template>
  <el-form :label-width="80" label-position="left" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <color-item label="颜色" name="color"/>
    <color-item label="高光" name="specular"/>
    <input-number-item label="高光大小" name="shininess"/>

    <color-item label="自发光" name="emissive"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2  }" label="自发光强度" name="emissiveIntensity"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="反射率" name="reflectivity"/>
    <bool-item label="顶点颜色" name="vertexColors"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="高光贴图" name="specularMap"/>

    <texture-item label="自发光贴图" name="emissiveMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="凹凸贴图" name="bumpMap"/>
    <input-number-item label="凹凸缩放" name="bumpScale"/>

    <texture-item label="法线贴图" name="bumpMap"/>
    <vector2-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="法线缩放" name="normalScale"/>

    <texture-item label="置换贴图" name="displacementMap"/>
    <input-number-item label="置换缩放" name="displacementScale"/>

    <texture-item label="环境贴图" name="envMap"/>
    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="环境光遮蔽贴图强度"
                       name="aoMapIntensity"/>

    <select-item :options="sideOptions" label="面" name="side"/>

    <bool-item label="平面着色" name="flatShading"/>

    <select-item :options="blendingOptions" label="混合" name="blending"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="透明度" name="opacity"/>
    <bool-item label="透明性" name="transparent"/>

    <bool-item label="强制单通道" name="forceSinglePass"/>

    <bool-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="α测试" name="alphaTest"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓冲" name="depthWrite"/>

    <bool-item label="线框" name="wireframe"/>
    <user-data-item/>
  </el-form>

</template>

<style scoped>
:deep(.el-form-item--small .el-form-item__label) {
  height: max-content;
}
</style>