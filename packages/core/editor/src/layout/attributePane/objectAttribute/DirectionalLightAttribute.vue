<script lang="ts" setup>
import {BoolItem, ColorItem, InputItem, InputNumberItem, TextItem, Vector3Item} from "../../../common-ui";
import {ElForm} from "element-plus";
import {useAttributeProvide, useBus} from "../../../hooks";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import UserDataItem from "../../../common-ui/attributeItem/UserDataItem.vue";

const bus = useBus();
const {toggle} = useAttributeProvide({
  isAutoUpdate: false,
  getObject: () => {
    return bus.selectObject
  }
})
const {} = useBindSubscribe({
  fun: toggle,
  isMounted: true,
  isViewerInit: false,
  isBindCallFun: false,
})
</script>

<template>
  <el-form label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <vector3-item label="位置" name="position"/>
    <input-number-item label="强度" name="intensity"/>
    <color-item label="颜色" name="color"/>

    <bool-item label="产生阴影" name="castShadow"/>
    <input-number-item :name="['shadow','intensity']" label="阴影偏移"/>
    <input-number-item :name="['shadow','bias']" label="阴影偏移"/>
    <input-number-item :name="['shadow','normalBias']" label="阴影法线偏移"/>
    <input-number-item :name="['shadow','radius']" label="阴影半径"/>

    <bool-item label="可见性" name="visible"/>
    <bool-item label="视锥体裁剪" name="frustumCulled"/>
    <input-number-item label="渲染次序" name="renderOrder"/>
    <user-data-item/>
  </el-form>
</template>

<style scoped>

</style>