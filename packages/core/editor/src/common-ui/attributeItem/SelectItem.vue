<script lang="ts" setup>
import type {ISelectProps} from "element-plus";
import {ElFormItem, ElOption, ElSelect, formContextKey,} from "element-plus";
import {useAttributeInject, useBus} from "../../hooks";
import {inject} from "vue";

interface Props {
  name: string;
  label: string;
  formProps?: Partial<ISelectProps>;
  options: Array<any>
}

const props = defineProps<Props>();
const {name, label} = props
const formContext = inject(formContextKey, undefined)
const bus = useBus();
const {change} = useAttributeInject(props)

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-select v-model="formContext!.model![name]" style="width: 100px" v-bind="props.formProps" @change="change">
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