<script setup lang="ts">
import {useBus} from "../../hooks";
import * as THREE from "three";
import {reactive} from "vue";
import {round} from "lodash-es";

const bus = useBus();

bus.viewerInitSubject.subscribe((value) => {
  console.log(value)
  const viewer = bus.viewer;
  if (!viewer) return
  const cameraControl = viewer.threeCameraControls.cameraControls;

  let position = new THREE.Vector3();
  let target = new THREE.Vector3();
  cameraControl.addEventListener("control", () => {
    cameraControl.getPosition(position);
    cameraControl.getTarget(target);

    info.position = `相机位置: X-${round(position.x,2)} Y:${round(position.y,2)} Z:${round(position.z,2)}`;
    info.target = `目标点: X:${round(target.x,2)} Y:${round(target.y,2)} Z:${round(target.z,2)}`;
  })
})

const info = reactive({
  target: "",
  position: "",
})
</script>

<template>
  <div class="bottom-[0px] z-999 h-[30px] flex items-center">

    <div>{{ info.target }}</div>
    <div class="ml-2">{{ info.position }}</div>
  </div>
</template>

<style scoped>

</style>