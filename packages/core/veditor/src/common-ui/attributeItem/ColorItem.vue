<script lang="ts" setup>
import {ElColorPicker, ElFormItem, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import {useBus} from "../../hooks";
import {isNil} from "lodash-es";

interface Props {
  name: string | string[];
  label: string;
}

const {name, label} = defineProps<Props>();
const formContext = inject(formContextKey, undefined)
const bus = useBus();
const change = (val: string | null) => {
  console.log(val)
  bus.objectAttributeChangeSubject.next({
    name: name,
    value: val
  });
}
const isRender = computed(() => {
  return !isNil(formContext.model[name])
})

const activeChange = (val: string | null)=>{
  console.log(val)
  bus.objectAttributeChangeSubject.next({
    name: name,
    value: val
  });
}

</script>

<template>
  <el-form-item  :label="label" size="small">
    <el-color-picker v-model="formContext.model[name]" @change="change" @active-change="activeChange"/>
  </el-form-item>
</template>

<style scoped>

</style>