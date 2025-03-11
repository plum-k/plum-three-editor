<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import BaseGeometryAttribute from "./BaseGeometryAttribute.vue";
import {useGeometryAttributeProvide} from "../../../hooks/useGeometryAttributeProvide.ts";

const bus = useBus();

// ui -> three
const {objectAttributeChangeSubject, toggle,updateTrigger} = useGeometryAttributeProvide({
  isAutoUpdate: false,
  getNewGeometry: (geometry, name, value) => {
    return {}
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

    <base-geometry-attribute/>
  </el-form>
</template>

<style scoped>

</style>