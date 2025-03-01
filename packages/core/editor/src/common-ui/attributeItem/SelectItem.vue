<script lang="ts" setup>
import {ElFormItem, ElSelect} from "element-plus";
import {useAttributeInject} from "../../hooks/useAttributeInject.ts";

interface Props {
  name: string | string[];
  label: string;
}

const props = defineProps<Props>();
const {objectAttributeChangeSubject, change} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-select/>
  </el-form-item>
</template>

<style scoped>

</style>