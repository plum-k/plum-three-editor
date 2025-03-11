<script lang="ts" setup>
import {ElForm} from "element-plus";
import * as THREE from "three";
import {useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {getGeometryValue, useGeometryAttributeProvide} from "../../../hooks/useGeometryAttributeProvide.ts";

const bus = useBus();


const {objectAttributeChangeSubject, toggle} = useGeometryAttributeProvide({
  isAutoUpdate: false,
  getNewGeometry: (geometry, name, value) => {
    return new THREE.TorusGeometry(
        getGeometryValue(geometry, "radius", name, value),
        getGeometryValue(geometry, "tube", name, value),
        getGeometryValue(geometry, "radialSegments", name, value),
        getGeometryValue(geometry, "tubularSegments", name, value),
        getGeometryValue(geometry, "arc", name, value) * THREE.MathUtils.DEG2RAD
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

    <input-number-item :name="['parameters','radius']" label="半径"/>
    <input-number-item :name="['parameters','tube']" label="管厚"/>
    <input-number-item :name="['parameters','radialSegments']" label="半径分段"/>
    <input-number-item :name="['parameters','tubularSegments']" label="管厚分段"/>
    <input-number-item :name="['parameters','arc']" label="弧度"/>

  </el-form>
</template>

<style scoped>

</style>