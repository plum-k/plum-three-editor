<script setup lang="ts">
import {ElFormItem, ElColorPicker} from "element-plus";

interface Props {
  prop: string | string[];
  label: string;
}

const {prop, label} = defineProps<Props>();

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-color-picker  />
  </el-form-item>
</template>

<style scoped>

</style>