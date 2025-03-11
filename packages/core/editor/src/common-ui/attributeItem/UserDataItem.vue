<script setup lang="ts">
import {InputItem} from "./index.ts";

const getUserData = (value: any) => {
  return JSON.stringify(value, null, '\t')
}
</script>

<template>
  <input-item :form-props="{type:'textarea'}" label="元数据" name="userData" :getValue="getUserData"/>
</template>

<style scoped>

</style>