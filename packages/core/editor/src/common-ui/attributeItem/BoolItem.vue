<script lang="ts" setup>
import {ElFormItem, ElSwitch} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import {defineModel} from "vue";

interface Props extends IAttributeProps {

}

const modelValue = defineModel<boolean>({
  default: undefined
})
const props = withDefaults(defineProps<Props>(), {})
const {name, label} = props
const {change,} = useAttributeInject(props, modelValue)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-switch v-model="modelValue" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>