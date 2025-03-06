<script lang="ts" setup>
import {ElFormItem, ElInput, formContextKey} from "element-plus";
import {inject} from "vue";
import {useBus} from "../../hooks";
import {useAttributeInject} from "../../hooks";

interface Props {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
const bus = useBus();
const props = defineProps<Props>();
const {name, label} = props;

const {objectAttributeChangeSubject, change} = useAttributeInject(props)


</script>

<template>
  <el-form-item :label="label" size="small">
    <el-input v-model="formContext!.model![name]" @change="change"/>
  </el-form-item>
</template>

<style scoped>

</style>