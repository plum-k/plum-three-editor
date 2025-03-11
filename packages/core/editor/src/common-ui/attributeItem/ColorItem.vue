<script lang="ts" setup>
import {ElColorPicker, ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import {ColorPickerPanel as TColorPickerPanel,ColorPicker as TColorPicker, ColorPickerPanelProps } from 'tdesign-vue-next';

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
    <t-color-picker
        v-model="modelValue"
        @change="change"
        format="HEX"
        borderless
        size="small"
        :color-modes="['monochrome']"
    />
<!--    <el-color-picker v-model="modelValue" @change="change" @focus="focus" @active-change="activeChange"/>-->
  </el-form-item>
</template>

<style scoped>

</style>