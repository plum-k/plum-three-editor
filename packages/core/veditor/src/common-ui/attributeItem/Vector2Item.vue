<script setup lang="ts">
import {ElFormItem, ElInputNumber, formContextKey} from "element-plus";
import {inject} from "vue";
import {useBus} from "../../hooks";

interface Props {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
const {name, label} = defineProps<Props>();
const bus = useBus();
const change = (value: number, key: string) => {
  console.log(value)
  bus.objectAttributeChangeSubject.next({
    name: [name, key],
    value: value
  });
}

</script>

<template>
  <el-form-item :label="label" size="small">
    <el-form-item label="x" size="small">
      <el-input-number
          v-model="formContext.model[name]['x']"
          size="small"
          controls-position="right"
          @change="(value)=>change(value,'x')"
      />
    </el-form-item>
    <el-form-item label="y" size="small">
      <el-input-number
          v-model="formContext.model[name]['y']"
          size="small"
          controls-position="right"
          @change="(value)=>change(value,'y')"
      />
    </el-form-item>
  </el-form-item>
</template>

<style scoped>

</style>