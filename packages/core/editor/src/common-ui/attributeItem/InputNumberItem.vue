<script lang="ts" setup>
import type {InputNumberProps} from "element-plus";
import {ElFormItem, ElInputNumber, formContextKey} from "element-plus";
import {inject} from "vue";
import {useAttributeInject, useBus} from "../../hooks";

interface Props {
  name: string;
  label: string;
  formProps?: Partial<InputNumberProps>;
}

const props = defineProps<Props>();
const {name, label} = props
const formContext = inject(formContextKey, undefined)
const { change} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input-number v-model="formContext!.model![name]" controls-position="right" v-bind="props.formProps"
                     @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>