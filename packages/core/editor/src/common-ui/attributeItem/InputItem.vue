<script lang="ts" setup>
import {ElFormItem, ElInput, formContextKey, type InputProps} from "element-plus";
import {inject} from "vue";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
interface Props  extends IAttributeProps{
  formProps?: Partial<InputProps>;
}

const formContext = inject(formContextKey, undefined)
const props = defineProps<Props>();
const {name, label} = props;
const {change} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input v-model="formContext!.model![name]" v-bind="props.formProps" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>