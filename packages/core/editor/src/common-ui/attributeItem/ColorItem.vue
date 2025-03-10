<script lang="ts" setup>
import {ElColorPicker, ElFormItem} from "element-plus";
import {type IAttributeProps, useAttributeInject} from "../../hooks";


const props = defineProps<IAttributeProps>();
const {name, label} = props
const {formContext, change, activeChange,focus} = useAttributeInject(props);


</script>

<template>
  <el-form-item :label="label" size="small">
    <el-color-picker v-model="formContext!.model![name]" @change="change" @active-change="activeChange" @focus="focus"/>
  </el-form-item>
</template>

<style scoped>

</style>