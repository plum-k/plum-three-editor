<script lang="ts" setup>
import {ElFormItem, ElInput, ElSwitch, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import {isNil} from "lodash-es";
import {useBus} from "../../hooks";

interface Props {
  name: string;
  label: string;
}
const formContext = inject(formContextKey, undefined)
const bus = useBus();
const {name, label} = defineProps<Props>();
const change = (value: string) => {
  console.log(value)
  bus.objectAttributeChangeSubject.next({
    name: name,
    value: value
  });
}
const isRender = computed(() => {
  return !isNil(formContext.model[name])
})
</script>

<template>
  <el-form-item v-if="isRender" :label="label" size="small">
    <el-input v-model="formContext.model[name]" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>