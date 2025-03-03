<script lang="ts" setup>
import {ElButton} from "element-plus";
import {useFullscreen} from "@vueuse/core";
import {useBus} from "../../hooks";
import {useRoute} from "vue-router";

const {isFullscreen, enter, exit, toggle} = useFullscreen(document.body)
const bus = useBus();
const route = useRoute();
const appId = route.params.appId as string;
const capture = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
  viewer.captureDown(appId);
}

const fit = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
  viewer.threeCameraControls.fitToScene(true)
}

</script>

<template>
  <el-button v-if="isFullscreen" @click="enter">推出全屏</el-button>
  <el-button v-else @click="exit">全屏</el-button>
  <el-button @click="capture">截屏</el-button>
  <el-button @click="fit">聚焦</el-button>
</template>

<style scoped>

</style>