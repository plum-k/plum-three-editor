<script lang="ts" setup>
import {ElButton, ElDescriptions, ElDescriptionsItem, ElForm} from "element-plus";
import {ref} from "vue";
import * as THREE from "three";
import {useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {getGeometryValue, useGeometryAttributeProvide} from "../../../hooks/useGeometryAttributeProvide.ts";
import BaseGeometryAttribute from "./BaseGeometryAttribute.vue";

const bus = useBus();

// ui -> three
const {objectAttributeChangeSubject, toggle,updateTrigger} = useGeometryAttributeProvide({
  isAutoUpdate: false,
  getNewGeometry: (geometry, name, value) => {
    return new THREE.BoxGeometry(
        getGeometryValue(geometry, "width", name, value),
        getGeometryValue(geometry, "height", name, value),
        getGeometryValue(geometry, "depth", name, value),
        getGeometryValue(geometry, "widthSegments", name, value),
        getGeometryValue(geometry, "heightSegments", name, value),
        getGeometryValue(geometry, "depthSegments", name, value)
    );
  }
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

    <input-number-item :name="['parameters','width']" label="宽度"/>
    <input-number-item :name="['parameters','height']" label="高度"/>
    <input-number-item :name="['parameters','depth']" label="深度"/>

    <input-number-item :name="['parameters','widthSegments']" label="宽度分割数"/>
    <input-number-item :name="['parameters','heightSegments']" label="高度分割数"/>
    <input-number-item :name="['parameters','depthSegments']" label="深度分割数"/>

    <base-geometry-attribute/>
  </el-form>
</template>

<style scoped>

</style>