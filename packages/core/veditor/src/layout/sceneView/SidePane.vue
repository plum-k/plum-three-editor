<script setup lang="ts">
import {reactive} from "vue";
import {ElButton, ElForm, ElPopover} from "element-plus";
import {useBus} from "../../hooks";
import {InputNumberItem} from "../../common-ui";
import * as THREE from "three";
import {set} from "lodash-es";

const bus = useBus();
const form = reactive({
  fov: 75, // 默认视场角（Field of View）
  near: 0.1, // 最近可视距离
  far: 1000, // 最远可视距离
  minDistance: 1, // 最小距离
  maxDistance: 100, // 最大距离
  minAzimuthAngle: -Infinity, // 最小方位角
  maxAzimuthAngle: Infinity, // 最大方位角
  minPolarAngle: 0, // 最小极角
  maxPolarAngle: Math.PI / 2 // 最大极角
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
})

const threeToUi = () => {
  const viewer = bus.viewer;
  if (!viewer) return
  const cameraControls = viewer.threeCameraControls.cameraControls;
  const camera = viewer.threeCameraControls.cameraControls.camera as THREE.PerspectiveCamera;

  form.fov = camera.fov;
  form.near = camera.near;
  form.far = camera.far;

  form.minDistance = cameraControls.minDistance;
  form.maxDistance = cameraControls.maxDistance;
  form.minAzimuthAngle = cameraControls.minAzimuthAngle;
  form.maxAzimuthAngle = cameraControls.maxAzimuthAngle;
  form.minPolarAngle = cameraControls.minPolarAngle;
  form.maxPolarAngle = cameraControls.maxPolarAngle;
}

bus.objectAttributeChangeSubject.subscribe((editValue) => {
  console.log(editValue)
  const {name, value} = editValue;

  const viewer = bus.viewer;
  if (!viewer) return
  const cameraControls = viewer.threeCameraControls.cameraControls;
  const camera = viewer.threeCameraControls.cameraControls.camera as THREE.PerspectiveCamera;

  const isCamera = ["fov", "near", "far"].includes(name as string)
  if (isCamera) {
    set(camera, name, value);
  }else {
    const isCameraControls = ["minDistance", "maxDistance", "minAzimuthAngle", "maxAzimuthAngle", "minPolarAngle", "maxPolarAngle"].includes(name as string)
    if (isCameraControls) {
      set(cameraControls, name, value);
    }
  }
})

const show = () => {
  threeToUi();
}
</script>

<template>
  <el-popover
      placement="bottom"
      title="Title"
      :width="200"
      trigger="hover"
      @show="show"
  >
    <template #reference>
      <el-button class="absolute top-[20px] right-[20px]">相机设置</el-button>
    </template>
    <el-form :model="form" label-width="auto" size="small" class="h-full">
      <input-number-item label="视野" name="fov"/>
      <input-number-item label="近裁剪平面" name="near"/>
      <input-number-item label="远裁剪平面" name="far"/>

      <input-number-item label="最小距离" name="minDistance"/>
      <input-number-item label="最大距离" name="maxDistance"/>
      <input-number-item label="最小旋转" name="minAzimuthAngle"/>
      <input-number-item label="最大旋转" name="maxAzimuthAngle"/>
      <input-number-item label="最小俯仰" name="minPolarAngle"/>
      <input-number-item label="最大俯仰" name="maxPolarAngle"/>
    </el-form>
  </el-popover>
</template>

<style scoped>

</style>