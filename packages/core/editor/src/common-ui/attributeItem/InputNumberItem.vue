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
const bus = useBus();
const {objectAttributeChangeSubject, change} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input-number v-model="formContext!.model![name]" v-bind="props.formProps" @change="change" controls-position="right"/>
  </el-form-item>
</template>

<style scoped>

</style>