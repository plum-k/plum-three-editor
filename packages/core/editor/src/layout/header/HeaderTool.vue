<script lang="ts" setup>
import {useFullscreen} from "@vueuse/core";
import {useBus} from "../../hooks";
import {useRoute} from "vue-router";
import Icon from "../../components/Icon.vue";
import {ElTooltip} from "element-plus";

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
  viewer?.cameraManager.fitToSceneBySphere(true)
}

</script>

<template>
  <div class="flex items-center gap-2 ml-100 text-[1.2rem]">

    <el-tooltip
        v-if="isFullscreen"
        content="推出全屏"
        effect="dark"
        placement="bottom"
    >
      <div>
        <icon icon-name="icon-quxiaoquanping" @click="exit"/>
      </div>
    </el-tooltip>
    <el-tooltip v-else
                class="box-item"
                content="全屏"
                effect="dark"
                placement="bottom"
    >
      <icon icon-name="icon-quanping" @click="enter"/>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        content="截图"
        effect="dark"
        placement="bottom"
    >
      <div>
        <icon icon-name="icon-jieping" @click="capture"/>
      </div>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        content="聚焦场景"
        effect="dark"
        placement="bottom"
    >
      <div>
        <icon icon-name="icon-jujiao" @click="fit"/>
      </div>
    </el-tooltip>
  </div>
</template>

<style scoped>

</style>