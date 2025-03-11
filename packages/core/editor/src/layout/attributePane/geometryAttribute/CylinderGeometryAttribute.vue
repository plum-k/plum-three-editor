<script lang="ts" setup>
import {ElForm} from "element-plus";
import * as THREE from "three";
import {useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {getGeometryValue, useGeometryAttributeProvide} from "../../../hooks/useGeometryAttributeProvide.ts";
import BaseGeometryAttribute from "./BaseGeometryAttribute.vue";

const bus = useBus();


const {objectAttributeChangeSubject, toggle} = useGeometryAttributeProvide({
  isAutoUpdate: false,
  getNewGeometry: (geometry, name, value) => {
    return new THREE.CylinderGeometry(
        getGeometryValue(geometry, "radiusTop", name, value),
        getGeometryValue(geometry, "radiusBottom", name, value),
        getGeometryValue(geometry, "height", name, value),
        getGeometryValue(geometry, "radialSegments", name, value),
        getGeometryValue(geometry, "heightSegments", name, value),
        getGeometryValue(geometry, "openEnded", name, value),
        getGeometryValue(geometry, "thetaStart", name, value),
        getGeometryValue(geometry, "thetaLength", name, value)
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

    <input-number-item :name="['parameters','radiusTop']" label="顶部半径"/>
    <input-number-item :name="['parameters','radiusBottom']" label="底部半径"/>
    <input-number-item :name="['parameters','height']" label="高度"/>

    <input-number-item :name="['parameters','radialSegments']" label="径向分段"/>
    <input-number-item :name="['parameters','heightSegments']" label="径向分段"/>
    <input-number-item :name="['parameters','openEnded']" label="开启"/>

    <input-number-item :name="['parameters','thetaStart']" label="弧度起点"/>
    <input-number-item :name="['parameters','thetaLength']" label="弧度长度"/>

    <base-geometry-attribute/>
  </el-form>
</template>

<style scoped>

</style>