<script lang="ts" setup>
import {CameraSettingPane} from "./index.ts";
import Tool from "./DebugTool.vue";
import CameraType from "./viewTool/CameraType.vue";
import CameraViewType from "./viewTool/CameraViewType.vue";
import SpaceType from "./viewTool/SpaceType.vue";
</script>

<template>
  <div class="relative h-8 bg-white flex items-center gap-1">
    <div class="flex-1">
    </div>
    <space-type/>
    <camera-type/>
    <camera-view-type/>
    <camera-setting-pane/>
    <tool/>
  </div>
</template>

<style scoped>

</style>