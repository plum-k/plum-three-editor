<script lang="ts" setup>
import {ElFormItem, ElInputNumber, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import type {InputNumberProps} from "element-plus/es/components/input-number/src/input-number";
import {get, isNil} from "lodash-es";
import {useBus} from "../../hooks";

interface Props extends Partial<InputNumberProps> {
  name: string;
  label: string;
}

const {name, label, ...rest} = defineProps<Props>();
const formContext = inject(formContextKey, undefined)

const bus = useBus();
const isRender = computed(() => {
  return !isNil(get(formContext.model, name))
})
const change = (cur: number | undefined, prev: number | undefined) => {
  console.log(cur)
  bus.objectAttributeChangeSubject.next({
    name: name,
    value: cur
  });
}
</script>

<template>
  <el-form-item v-if="isRender" :label="label" size="small">
    <el-input-number v-model="formContext.model[name]" :bind="rest" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>