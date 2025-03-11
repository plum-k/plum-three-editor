<script lang="ts" setup>
import {ElForm} from "element-plus";
import * as THREE from "three";
import {useBus} from "../../../hooks";
import {InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {getGeometryValue, useGeometryAttributeProvide} from "../../../hooks/useGeometryAttributeProvide.ts";

const bus = useBus();

const {objectAttributeChangeSubject, toggle} = useGeometryAttributeProvide({
  isAutoUpdate: false,
  getNewGeometry: (geometry, name, value) => {
    return new THREE.CircleGeometry(
        getGeometryValue(geometry, "radius", name, value),
        getGeometryValue(geometry, "segments", name, value),
        getGeometryValue(geometry, "thetaStart", name, value) * THREE.MathUtils.DEG2RAD,
        getGeometryValue(geometry, "thetaLength", name, value) * THREE.MathUtils.DEG2RAD
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
    <input-number-item :name="['parameters','segments']" label="分段"/>
    <input-number-item :name="['parameters','thetaStart']" label="弧度起点"/>
    <input-number-item :name="['parameters','thetaLength']" label="弧度长度"/>

  </el-form>
</template>

<style scoped>

</style>