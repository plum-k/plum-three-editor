<script lang="ts" setup>
import {ElFormItem, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import type {InputNumberProps} from "element-plus/es/components/input-number/src/input-number";
import {get, isNil} from "lodash-es";
import {useBus} from "../../hooks";
import {useAttributeInject} from "../../hooks/useAttributeInject.ts";

interface Props extends Partial<InputNumberProps> {
  name: string;
  label: string;
}

const props = defineProps<Props>();
const {name, label} = props
const formContext = inject(formContextKey, undefined)
const bus = useBus();
const isRender = computed(() => {
  return !isNil(get(formContext.model, name))
})
const {objectAttributeChangeSubject, change} = useAttributeInject(props)
</script>

<template>
  <el-form-item v-if="isRender" :label="label" size="small">
    <el-inpuel-number v-model="formContext.model[name]" :bind="props" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>