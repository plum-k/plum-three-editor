<script lang="ts" setup>
import {ElButton} from "element-plus";
import {useFullscreen} from "@vueuse/core";
import {useBus} from "../../hooks";
import {useRoute} from "vue-router";
import Icon from "../../components/Icon.vue";

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
  viewer.threeCameraControls.fitToSceneBySphere(true)
}
</script>

<template>
  <div class="flex items-center gap-2 ml-100 text-[1.2rem]">
    <icon  icon-name="icon-quxiaoquanping" v-if="isFullscreen" @click="exit"/>
    <icon icon-name="icon-quanping"  v-else @click="enter"/>
    <icon icon-name="icon-jieping" @click="capture"/>
    <icon icon-name="icon-jujiao" @click="fit"/>
  </div>
</template>

<style scoped>

</style>