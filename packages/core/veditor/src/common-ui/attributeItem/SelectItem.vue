<script setup lang="ts">
import {ElFormItem, ElSelect} from "element-plus";

interface Props {
  prop: string | string[];
  label: string;
}

const {prop, label} = defineProps<Props>();

</script>

<template>
  <el-form-item :label="label" :prop="prop">
    <el-select/>
  </el-form-item>
</template>

<style scoped>

</style>