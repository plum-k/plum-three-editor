<script lang="ts" setup>
import {ElFormItem, formContextKey} from "element-plus";
import {inject} from "vue";
import {useBus} from "../../hooks";
import {useAttributeInject} from "../../hooks/useAttributeInject.ts";

interface Props {
  name: string;
  label: string;
}

const formContext = inject(formContextKey, undefined)
// const formContext = inject(formContextKey, undefined)
const props = defineProps<Props>();
const {name, label} = props

const bus = useBus();
const {objectAttributeChangeSubject,} = useAttributeInject(props)
const change = (value: number, key: string) => {

  objectAttributeChangeSubject.next({
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
          controls-position="right"
          size="small"
          @change="(value)=>change(value,'x')"
      />
    </el-form-item>
    <el-form-item label="y" size="small">
      <el-input-number
          v-model="formContext.model[name]['y']"
          controls-position="right"
          size="small"
          @change="(value)=>change(value,'y')"
      />
    </el-form-item>
    <el-form-item label="z" size="small">
      <el-input-number
          v-model="formContext.model[name]['z']"
          controls-position="right"
          size="small"
          @change="(value)=>change(value,'z')"
      />
    </el-form-item>
  </el-form-item>
</template>

<style scoped>

</style>