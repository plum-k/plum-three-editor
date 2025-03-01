<script setup lang="ts">
import {ref} from "vue";
import {ElOption, ElSelect} from "element-plus";
import {useBus} from "../../hooks";
import {CameraViewType} from "@plum-render/three-sdk";

const bus = useBus();

const cameraView = ref("top");

const cameraViewArray = [
  { label: "透视图", value: CameraViewType.Perspective },
  { label: "顶视图", value: CameraViewType.Top },
  { label: "底视图", value: CameraViewType.Bottom },
  { label: "前视图", value: CameraViewType.Front },
  { label: "后视图", value: CameraViewType.Back },
  { label: "右视图", value: CameraViewType.Right },
  { label: "左视图", value: CameraViewType.Left },
];
const change = (val: CameraViewType) => {
  console.log(val)
  const viewer = bus.viewer;
  if (viewer) {
      viewer.threeCameraControls.setCameraViewType(val);
  }
}
</script>

<template>
  <el-select v-model="cameraView" size="small" @change="change"
             class="!absolute top-[20px] left-[100px] z-999 !w-[80px]">
    <el-option v-for="item in cameraViewArray" :key="item.value" :value="item.value" :label="item.label"/>
  </el-select>
</template>

<style scoped>

</style>