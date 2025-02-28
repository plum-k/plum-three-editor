<script lang="ts" setup>
import {ElFormItem, ElSelect} from "element-plus";

interface Props {
  name: string | string[];
  label: string;
}

const {name, label} = defineProps<Props>();

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-select/>
  </el-form-item>
</template>

<style scoped>

</style>