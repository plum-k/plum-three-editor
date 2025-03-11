<script lang="ts" setup>
import {ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";

interface Props extends IAttributeProps {
}

const props = defineProps<Props>();
const {label} = props
const {modelValue} = useAttributeInject(props);
</script>

<template>
  <el-form-item :label="label" size="small">
    {{ modelValue }}
  </el-form-item>
</template>

<style scoped>

</style>