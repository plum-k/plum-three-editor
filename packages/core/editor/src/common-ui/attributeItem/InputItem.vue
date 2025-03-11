<script lang="ts" setup>
import {ElFormItem, ElInput, formContextKey, type InputProps} from "element-plus";
import {inject} from "vue";
import {type IAttributeProps, useAttributeInject, useBus} from "../../hooks";

interface Props extends IAttributeProps {
  formProps?: Partial<InputProps>;
}
const props = defineProps<Props>();
const {name, label} = props;
const {change, modelValue} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input v-model="modelValue" v-bind="props.formProps" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>