<script lang="ts" setup>
import {ElFormItem, ElSwitch, formContextKey, type SwitchProps} from "element-plus";
import {computed, getCurrentInstance, inject} from "vue";
import {useBus} from "../../hooks";
import {get, isNil} from "lodash-es";
import {useAttributeInject} from "../../hooks/useAttributeInject.ts";

interface Props extends Partial<SwitchProps> {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
const props = defineProps<Props>();
const {name, label} = props
const bus = useBus();


const instance = getCurrentInstance();
const {ctx} = getCurrentInstance();
const {proxy} = getCurrentInstance();

const {objectAttributeChangeSubject, change} = useAttributeInject(props)
const isRender = computed(() => {
  console.log("proxy", proxy)
  console.log("formContext", formContext)
  return !isNil(get(formContext.model, name))
})
</script>

<template>
  <el-form-item v-if="isRender" :label="label" size="small">
    <el-switch v-model="formContext.model[name]" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>