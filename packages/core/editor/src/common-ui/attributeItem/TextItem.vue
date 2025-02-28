<script lang="ts" setup>

import {ElFormItem, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import {get} from "lodash-es";

interface Props {
  name: string;
  label: string;
}

const {name, label} = defineProps<Props>();
const formContext = inject(formContextKey, undefined)
const value = computed(() => {
  // console.log(formContext)
  // console.log(get(formContext?.model, prop))
  return get(formContext?.model, name)
})


</script>

<template>
  <el-form-item :label="label" size="small">
    {{ value }}
  </el-form-item>
</template>

<style scoped>

</style>