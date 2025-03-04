<script lang="ts" setup>

import {CameraSettingPane} from "./index.ts";
import CameraView from "./CameraView.vue";
import Tool from "./DebugTool.vue";
</script>

<template>
  <div class="relative h-8 bg-white flex items-center gap-1">
    <div class="flex-1">
    </div>
    <camera-view/>
    <camera-setting-pane/>
    <tool/>
  </div>
</template>

<style scoped>

</style>