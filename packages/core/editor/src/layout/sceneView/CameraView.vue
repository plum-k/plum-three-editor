<script lang="ts" setup>
import {ref} from "vue";
import {ElOption, ElSelect} from "element-plus";
import {useBus} from "../../hooks";
import {CameraViewType} from "@plum-render/three-sdk";

const bus = useBus();

const cameraView = ref("top");

const cameraViewArray = [
  {label: "透视图", value: CameraViewType.Perspective},
  {label: "顶视图", value: CameraViewType.Top},
  {label: "底视图", value: CameraViewType.Bottom},
  {label: "前视图", value: CameraViewType.Front},
  {label: "后视图", value: CameraViewType.Back},
  {label: "右视图", value: CameraViewType.Right},
  {label: "左视图", value: CameraViewType.Left},
];
const change = (val: CameraViewType) => {

  const viewer = bus.viewer;
  if (viewer) {
    viewer.threeCameraControls.setCameraViewType(val);
  }
}
</script>

<template>
  <el-select v-model="cameraView" class="!absolute top-[20px] left-[100px] z-999 !w-[80px]" size="small"
             @change="change">
    <el-option v-for="item in cameraViewArray" :key="item.value" :label="item.label" :value="item.value"/>
  </el-select>
</template>

<style scoped>

</style>