<script setup lang="ts">
import {ElFormItem, ElSwitch, formContextKey, type SwitchProps} from "element-plus";
import {computed, inject} from "vue";
import {useBus} from "../../hooks";
import {isNil} from "lodash-es";

interface Props extends Partial<SwitchProps> {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
const {name, label} = defineProps<Props>();
const bus = useBus();
const change = (value: boolean) => {
  console.log(value)
  bus.objectAttributeChangeSubject.next({
    name: name,
    value: value
  });
}
const isRender = computed(() => {
  return  !isNil(formContext.model[name])
})
</script>

<template>
  <el-form-item v-if="isRender" :label="label" size="small">
    <el-switch v-model="formContext.model[name]" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>