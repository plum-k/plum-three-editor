<script lang="ts" setup>
import {ElForm} from "element-plus";

import {isCapsuleGeometry, isMesh} from "three-is";
import {useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {getGeometryValue, useGeometryAttributeProvide} from "../../../hooks/useGeometryAttributeProvide.ts";
import BaseGeometryAttribute from "./BaseGeometryAttribute.vue";

const bus = useBus();



// ui -> three
const {objectAttributeChangeSubject, toggle} = useGeometryAttributeProvide({
  isAutoUpdate: false,
  getNewGeometry: (geometry, name, value) => {
    return new CapsuleGeometry(
        getGeometryValue(geometry, "radius", name, value),
        getGeometryValue(geometry, "length", name, value),
        getGeometryValue(geometry, "capSegments", name, value),
        getGeometryValue(geometry, "radialSegments", name, value)
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
    <input-number-item :name="['parameters','length']" label="长度"/>
    <input-number-item :name="['parameters','capSegments']" label="切片数"/>
    <input-number-item :name="['parameters','radialSegments']" label="切片数"/>

    <base-geometry-attribute/>
  </el-form>
</template>

<style scoped>

</style>