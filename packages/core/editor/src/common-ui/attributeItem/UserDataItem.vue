<script lang="ts" setup>
import {InputItem} from "./index.ts";

const getUserData = (value: any) => {
  return JSON.stringify(value, null, '\t')
}
</script>

<template>
  <input-item :form-props="{type:'textarea'}" :getValue="getUserData" label="元数据" name="userData"/>
</template>

<style scoped>

</style>