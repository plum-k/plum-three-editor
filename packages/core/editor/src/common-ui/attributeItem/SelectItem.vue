<script lang="ts" setup>
import type {ISelectProps} from "element-plus";
import {ElFormItem, ElOption, ElSelect,} from "element-plus";
import {type IAttributeProps, useAttributeInject, useBus} from "../../hooks";

interface Props extends IAttributeProps {
  formProps?: Partial<ISelectProps>;
  options: Array<any>
}

const props = defineProps<Props>();
const {name, label} = props
const bus = useBus();
const {formContext, change, activeChange, focus, modelValue} = useAttributeInject(props);
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-select v-model="modelValue" style="width: 100px" v-bind="props.formProps" @change="change">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </el-form-item>
</template>

<style scoped>

</style>