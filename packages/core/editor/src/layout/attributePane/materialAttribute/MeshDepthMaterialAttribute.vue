<script lang="ts" setup>
import {useBus} from "../../../hooks";
import {useMaterialAttributeProvide} from "../../../hooks/useMaterialAttributeProvide.ts";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {blendingOptions, materialDepthPackingOptions, sideOptions} from "./selectOptions.ts";
import {BoolItem, InputItem, InputNumberItem, SelectItem, TextItem} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";
import {ElForm} from "element-plus";
import UserDataItem from "../../../common-ui/attributeItem/UserDataItem.vue";

const bus = useBus();

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

    <bool-item label="顶点颜色" name="vertexColors"/>
    <select-item :options="materialDepthPackingOptions" label="深度包装" name="depthPacking"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="置换贴图" name="displacementMap"/>
    <input-number-item label="置换缩放" name="displacementScale"/>

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