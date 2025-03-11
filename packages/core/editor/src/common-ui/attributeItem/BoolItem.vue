<script lang="ts" setup>
import {ElFormItem, ElSwitch, formContextKey, type SwitchProps} from "element-plus";
import {inject} from "vue";
import {useAttributeInject} from "../../hooks";

interface Props extends Partial<SwitchProps> {
  name: string;
  label: string;
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