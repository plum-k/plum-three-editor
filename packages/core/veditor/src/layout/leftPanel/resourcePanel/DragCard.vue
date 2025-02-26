<script setup lang="ts">
import {ElCol, ElRow} from "element-plus";
import type {IDragInfo} from "../../../interface/IDragInfo.ts";

interface Props extends IDragInfo {
}

const props = defineProps<Props>();
const {label} = props;
const onDragStart = (event: any) => {
  event.dataTransfer.setData('data', JSON.stringify(props))
}

</script>

<template>
  <el-row>
    <el-col :span="12" @dragstart="onDragStart">
      <div class="mt-2 ml-auto mr-auto">{{ label }}</div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>