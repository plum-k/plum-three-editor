<script lang="ts" setup>
import type {InputNumberProps} from "element-plus";
import {ElFormItem, ElInputNumber, formContextKey} from "element-plus";
import {defineModel, inject} from "vue";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import * as THREE from "three";

interface Props extends IAttributeProps {
  isItem?: boolean;
  isRotation?: boolean
  formProps?: Partial<InputNumberProps>;
}

const modelValue = defineModel<number>({
  default: undefined
})
const props = withDefaults(defineProps<Props>(), {
  isItem: true,
  isRotation: false,
})
// const props = defineProps<Props>();
const {name, label = "", isItem, isRotation} = props;
console.log("isRotation1111",isRotation)
const formContext = inject(formContextKey, undefined);
const {change, activeChange, focus,} = useAttributeInject({
  ...props,
  getValue: (value) => {
    console.log(isRotation)
    if (isRotation) {
      console.log("qqq",value)
      return THREE.MathUtils.radToDeg(value);
    } else {
      return value
    }
  }
}, modelValue);
</script>

<template>
  <el-form-item v-if="isItem" :label="label" size="small">
    <el-input-number v-model="modelValue" controls-position="right" v-bind="props.formProps"
                     @change="change"/>
  </el-form-item>
  <el-input-number v-else v-model="modelValue" controls-position="right" v-bind="props.formProps"
                   @change="change"/>
</template>

<style scoped>

</style>