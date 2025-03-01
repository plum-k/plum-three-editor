<script lang="ts" setup>
import {ElFormItem, ElInput, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import {isNil} from "lodash-es";
import {useBus} from "../../hooks";
import {useAttributeInject} from "../../hooks/useAttributeInject.ts";

interface Props {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
const bus = useBus();
const props = defineProps<Props>();
const {name, label} = props;

const {objectAttributeChangeSubject, change} = useAttributeInject(props)

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