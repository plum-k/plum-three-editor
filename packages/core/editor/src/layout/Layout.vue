<script lang="ts" setup>
import {Pane, Splitpanes} from 'splitpanes'
import '../styles/splitpanes.css'
import LeftPanel from "./leftPanel/LeftPanel.vue";
import SceneView from "./SceneView.vue";
import AttributePane from "./AttributePane.vue";
</script>

<template>
  <splitpanes class="default-theme" style="height: calc(100% - 32px)">
    <pane size="20">
      <LeftPanel/>
    </pane>
    <pane size="60">
      <SceneView/>
    </pane>
    <pane size="20">
      <AttributePane/>
    </pane>
  </splitpanes>
</template>

<style scoped>


</style>