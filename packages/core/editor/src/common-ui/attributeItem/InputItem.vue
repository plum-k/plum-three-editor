<script lang="ts" setup>
import {ElFormItem, ElInput, type InputProps} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import {defineModel} from "vue";

interface Props extends IAttributeProps {
  formProps?: Partial<InputProps>;
}
const modelValue = defineModel<string>({
  default: ""
})
const props = withDefaults(defineProps<Props>(), {

})
const {name, label} = props
const {change, internalModelValue} = useAttributeInject(props,modelValue)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input v-model="internalModelValue" v-bind="props.formProps" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>