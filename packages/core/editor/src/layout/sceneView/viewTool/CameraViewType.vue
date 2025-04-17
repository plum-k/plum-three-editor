<script lang="ts" setup>
import {ref} from "vue";
import {ElOption, ElSelect} from "element-plus";
import {useBus} from "../../../hooks";
import {ECameraViewType} from "@plum-render/three-sdk";

const bus = useBus();

const cameraView = ref("透视视图");

const cameraViewArray = [
  {label: "透视视图", value: ECameraViewType.PerspectiveView},
  {label: "顶视图", value: ECameraViewType.Top},
  {label: "底视图", value: ECameraViewType.Bottom},
  {label: "前视图", value: ECameraViewType.Front},
  {label: "后视图", value: ECameraViewType.Back},
  {label: "右视图", value: ECameraViewType.Right},
  {label: "左视图", value: ECameraViewType.Left},
];
const change = (val: ECameraViewType) => {
  const viewer = bus.viewer;
  if (viewer) {
    viewer.cameraComponent.setCameraViewType(val);
  }
}
</script>

<template>
  <el-select v-model="cameraView" class="z-999 !w-[90px]" size="small"
             @change="change">
    <el-option v-for="item in cameraViewArray" :key="item.value" :label="item.label" :value="item.value"/>
  </el-select>
</template>

<style scoped>

</style>