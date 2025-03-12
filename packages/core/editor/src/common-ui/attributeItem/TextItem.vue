<script lang="ts" setup>
import {ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";

const modelValue = defineModel<string>({
  default: ""
})
const props = withDefaults(defineProps<IAttributeProps>(), {

})
const {name, label} = props
const {change, internalModelValue} = useAttributeInject(props,modelValue)
</script>

<template>
  <el-form-item :label="label" size="small">
    {{ internalModelValue }}
  </el-form-item>
</template>

<style scoped>

</style>