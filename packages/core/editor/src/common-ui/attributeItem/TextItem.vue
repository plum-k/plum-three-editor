<script lang="ts" setup>
import {ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";

const modelValue = defineModel<string>({
  default: undefined
})
const props = withDefaults(defineProps<IAttributeProps>(), {})
const {label} = props
const {} = useAttributeInject(props, modelValue)
</script>

<template>
  <el-form-item :label="label" size="small">
    {{ modelValue }}
  </el-form-item>
</template>

<style scoped>

</style>