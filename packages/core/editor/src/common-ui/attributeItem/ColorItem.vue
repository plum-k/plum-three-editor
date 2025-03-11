<script lang="ts" setup>
import {ElColorPicker, ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";


const props = defineProps<IAttributeProps>();
const {name, label} = props
const {formContext, change, activeChange, focus, modelValue} = useAttributeInject({
  ...props,
  isMiddle: true,
  getValue: (value) => {
    return `#${value.getHexString()}`
  }
});

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-color-picker v-model="modelValue" @change="change" @active-change="activeChange" @focus="focus"/>
  </el-form-item>
</template>

<style scoped>

</style>