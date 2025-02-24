<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {ElForm} from "element-plus";
import TextItem from "../../common-ui/attributeItem/TextItem.vue";
import Vector3Item from "../../common-ui/attributeItem/Vector3Item.vue";
import InputNumberItem from "../../common-ui/attributeItem/InputNumberItem.vue";
import ColorItem from "../../common-ui/attributeItem/ColorItem.vue";
import BoolItem from "../../common-ui/attributeItem/BoolItem.vue";

const form = reactive({
  prop: '',
  region: '',
  date1: '',
  date2: '',
  uuid: "213他78yuadfq",
  type: "1212121",
  resource: '',
  desc: '',
})

</script>

<template>
  <el-form :model="form" label-width="auto" class="h-full">
    <TextItem label="类型" prop="type"/>
    <TextItem label="唯一标识" prop="uuid"/>
    <TextItem label="名称" prop="prop"/>
<!--    <Vector3Item label="位置" basePropertyName="position"/>-->
<!--    <Vector3Item label="旋转" basePropertyName="rotation" />-->
<!--    <Vector3Item label="缩放" basePropertyName="scale"/>-->
<!--    <InputNumberItem label="强度" prop="intensity"/>-->
<!--    <ColorItem label="颜色" prop="color"/>-->
    <BoolItem label="可见性" prop="visible"/>
<!--    <InputNumberItem label="阴影强度" prop={["shadow", "intensity"]}/>-->
<!--    <InputNumberItem label="阴影偏移" prop={["shadow", "bias"]}/>-->
<!--    <InputNumberItem label="阴影法线偏移" prop={["shadow", "normalBias"]}/>-->
<!--    <InputNumberItem label="阴影半径" prop={["shadow", "radius"]}/>-->
<!--    <ColorItem label="基色" prop="groundcolor"/>-->
<!--    <InputNumberItem label="距离" prop="distance"/>-->
<!--    <InputNumberItem label="角度" prop="angle"/>-->
<!--    <InputNumberItem label="边缘" prop="penumbra"/>-->
<!--    <InputNumberItem label="衰减" prop="decay"/>-->
<!--    <BoolItem label="接收阴影" prop="receiveShadow"/>-->
<!--    <BoolItem label="产生阴影" prop="castShadow"/>-->
<!--    <BoolItem label="视锥体裁剪" prop="frustumCulled"/>-->
<!--    <InputNumberItem label="渲染次序" prop="renderOrder"/>-->
<!--    <JsonItem label="自定义数据" prop="userData"/>-->

  </el-form>
</template>

<style scoped>

</style>