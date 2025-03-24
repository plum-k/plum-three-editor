<script lang="ts" setup>
import {ref} from "vue";
import {ElOption, ElSelect} from "element-plus";
import {useBus} from "../../../hooks";
import {ECameraType} from "@plum-render/three-sdk";

const bus = useBus();

const cameraView = ref("透视相机");

const cameraViewArray = [
  {label: "透视相机", value: ECameraType.PerspectiveCamera},
  {label: "正交相机", value: ECameraType.OrthographicCamera},
];
const change = (val: ECameraType) => {
  const viewer = bus.viewer;
  if (viewer) {
    viewer.cameraManager.setCameraType(val);
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