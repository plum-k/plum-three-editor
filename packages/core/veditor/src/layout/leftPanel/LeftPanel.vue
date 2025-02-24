<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import SceneTree from "./SceneTree.vue";
import ResourcePanel from "./ResourcePanel.vue";
</script>

<template>
  <div class="bg-white overflow-hidden h-full w-full m-0 pb-5">
    <splitpanes class="default-theme" horizontal>
      <pane >
        <SceneTree/>
      </pane>
      <pane >
        <ResourcePanel/>
      </pane>
    </splitpanes>
  </div>
</template>

<style scoped>

</style>