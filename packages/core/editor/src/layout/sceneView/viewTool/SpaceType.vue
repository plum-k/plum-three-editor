<script lang="ts" setup>
import {ref} from "vue";
import {ElOption, ElSelect} from "element-plus";
import {useBus} from "../../../hooks";

const bus = useBus();

const cameraView = ref("世界");

const spaceArray = [
  {label: "世界", value: 'world'},
  {label: "本地", value: "local"},
];
const change = (val: "world" | "local") => {
  const editor = bus.editor;
  if (editor) {
    editor.setSpace(val);
  }
}
</script>

<template>
  <el-select v-model="cameraView" class="z-999 !w-[90px]" size="small"
             @change="change">
    <el-option v-for="item in spaceArray" :key="item.value" :label="item.label" :value="item.value"/>
  </el-select>
</template>

<style scoped>

</style>