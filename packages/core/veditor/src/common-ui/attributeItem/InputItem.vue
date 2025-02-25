<script setup lang="ts">
import {ElFormItem, ElInput} from "element-plus";

interface Props {
  prop: string | string[];
  label: string;
}

const {prop, label} = defineProps<Props>();

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input/>
  </el-form-item>
</template>

<style scoped>

</style>