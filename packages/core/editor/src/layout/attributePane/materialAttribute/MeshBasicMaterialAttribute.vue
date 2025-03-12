<script lang="ts" setup>
import {ElForm} from "element-plus";
import {BoolItem, ColorItem, InputItem, InputNumberItem, SelectItem, TextItem} from "../../../common-ui";
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
  <el-form label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <color-item label="颜色" name="color"/>
    <input-number-item label="反射率" name="reflectivity"/>

    <bool-item label="顶点颜色" name="vertexColors"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="高光贴图" name="specularMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="环境贴图" name="envMap"/>
    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item label="环境光遮蔽贴图强度" name="aoMapIntensity"/>

    <select-item :options="sideOptions" label="面" name="side"/>
    <select-item :options="blendingOptions" label="混合" name="blending"/>

    <input-number-item label="透明度" name="opacity"/>
    <bool-item label="透明性" name="transparent"/>

    <bool-item label="强制单通道" name="forceSinglePass"/>
    <bool-item label="α测试" name="alphaTest"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓冲" name="depthWrite"/>
    <bool-item label="线框" name="wireframe"/>
    <user-data-item/>
  </el-form>

</template>

<style scoped>

</style>