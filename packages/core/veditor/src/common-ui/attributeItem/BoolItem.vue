<script setup lang="ts">
import {ElFormItem, ElSwitch} from "element-plus";

interface Props {
  prop: string | string[];
  label: string;
}

const {prop, label} = defineProps<Props>();

</script>

<template>
  <el-form-item :label="label" :prop="prop">
    <el-switch/>
  </el-form-item>
</template>

<style scoped>

</style>