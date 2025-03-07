<script lang="ts" setup>
import {ElFormItem, ElInput, formContextKey} from "element-plus";
import {inject} from "vue";
import {type IAttributeProps, useAttributeInject} from "../../hooks";

const formContext = inject(formContextKey, undefined)
const props = defineProps<IAttributeProps>();
const {name, label} = props;
const {change} = useAttributeInject(props)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input v-model="formContext!.model![name]" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>