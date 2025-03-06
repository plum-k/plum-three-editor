<script lang="ts" setup>
import {ElColorPicker, ElFormItem, formContextKey} from "element-plus";
import {inject} from "vue";
import {type IAttributeProps, useAttributeInject} from "../../hooks";


const props = defineProps<IAttributeProps>();
const {name, label} = props
const formContext = inject(formContextKey, undefined)
const {objectAttributeChangeSubject, change} = useAttributeInject(props)

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-color-picker v-model="formContext!.model![name]" @change="change" @active-change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>