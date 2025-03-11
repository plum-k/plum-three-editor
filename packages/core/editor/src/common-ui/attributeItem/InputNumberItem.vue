<script lang="ts" setup>
import type {InputNumberProps} from "element-plus";
import {ElFormItem, ElInputNumber, formContextKey} from "element-plus";
import {inject} from "vue";
import {type IAttributeProps, useAttributeInject} from "../../hooks";
import * as THREE from "three";

interface Props extends IAttributeProps {
  isItem?: boolean;
  isRotation?: boolean
  formProps?: Partial<InputNumberProps>;
}

const props = withDefaults(defineProps<Props>(), {
  isItem: true,
  isRotation: false
})
// const props = defineProps<Props>();
const {name, label = "", isItem, isRotation} = props;
const formContext = inject(formContextKey, undefined);
const {change, activeChange, focus, modelValue} = useAttributeInject({
  ...props,
  getValue: (value) => {
    if (isRotation){
      THREE.MathUtils.degToRad(value);
    }else {
      return value
    }
  }
});
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