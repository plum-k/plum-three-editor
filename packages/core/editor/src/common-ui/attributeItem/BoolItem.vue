<script lang="ts" setup>
import {ElFormItem, ElSwitch, formContextKey, type SwitchProps} from "element-plus";
import {inject} from "vue";
import {useAttributeInject} from "../../hooks";

interface Props extends Partial<SwitchProps> {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
const props = defineProps<Props>();
const {name, label} = props
const {change} = useAttributeInject(props)

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-switch v-model="formContext!.model![name]" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>