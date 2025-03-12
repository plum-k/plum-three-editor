<script lang="ts" setup>
import {ElColorPicker, ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import {ColorPickerPanel as TColorPickerPanel,ColorPicker as TColorPicker, ColorPickerPanelProps } from 'tdesign-vue-next';
import {defineModel} from "vue";
// 外部直接传入的model
const modelValue = defineModel<string>({
  default: "#ffffff"
})
const props = withDefaults(defineProps<IAttributeProps>(), {
  isMiddle: true,
  getValue: (value) => {
    return `#ffffff`
    // return `#${value.getHexString()}`
  }
})

const {name, label} = props
const {formContext, change, activeChange, focus,} = useAttributeInject(props,modelValue);
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