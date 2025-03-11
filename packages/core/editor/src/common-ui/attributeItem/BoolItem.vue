<script lang="ts" setup>
import {ElFormItem, ElSwitch} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";

interface Props extends IAttributeProps {

}

const props = defineProps<Props>();
const {name, label} = props
const {change, modelValue} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-switch v-model="modelValue" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>