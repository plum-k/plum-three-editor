<script lang="ts" setup>
import {Pane, Splitpanes} from 'splitpanes'
import SceneTree from "./SceneTree.vue";
import ResourcePanel from "./ResourcePanel.vue";
</script>

<template>
  <div class="bg-white overflow-hidden h-full w-full m-0">
    <splitpanes class="default-theme" horizontal>
      <pane>
        <SceneTree/>
      </pane>
      <pane>
        <ResourcePanel/>
      </pane>
    </splitpanes>
  </div>
</template>

<style scoped>

</style>