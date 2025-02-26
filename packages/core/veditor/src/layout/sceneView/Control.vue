<script setup lang="ts">
import { ElSegmented } from 'element-plus'
import { ref } from 'vue'
import {useBus} from "../../hooks";

const value = ref('Mon')
const options = ["A", "B", "C"]
const bus = useBus();

const change = (val: string) => {
  console.log(val)
  const viewer = bus.viewer;
  if (viewer) {
    viewer.editor.transformControlsWarp.transformControls.setMode(val);
  }
}
</script>

<template>
  <div class="absolute top-[20px] left-[10px] z-999">
    <el-segmented v-model="value" :options="options" size="small" @change="change" />
  </div>
</template>

<style scoped>

</style>