<script setup lang="ts">
import {ElFormItem, ElInput} from "element-plus";

interface Props {
  prop: string | string[];
  label: string;
}

const {prop, label} = defineProps<Props>();

</script>

<template>
  <el-form-item :label="label" :prop="prop">
    <el-input/>
  </el-form-item>
</template>

<style scoped>

</style>