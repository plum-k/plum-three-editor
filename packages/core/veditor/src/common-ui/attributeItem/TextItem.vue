<script setup lang="ts">

import {ElFormItem, formContextKey} from "element-plus";
import {computed, inject} from "vue";
import {get} from "lodash-es";

interface Props {
  prop: string | string[];
  label: string;
}

const {prop, label} = defineProps<Props>();
const formContext = inject(formContextKey, undefined)
const value = computed(() => {
  // console.log(formContext)
  // console.log(get(formContext?.model, prop))
  return get(formContext?.model, prop)
})


</script>

<template>
  <el-form-item :label="label">
    {{ value }}
  </el-form-item>
</template>

<style scoped>

</style>