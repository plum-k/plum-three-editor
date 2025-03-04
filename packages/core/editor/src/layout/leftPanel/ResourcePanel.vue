<script lang="ts" setup>
import {ElTabs} from 'element-plus'
import {ref} from 'vue'
import {BaseResourcePanel} from "./resourcePanel";

const activeName = ref('基础')

const handleClick = (tab: any, event: Event) => {

}

</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-panel label="基础" name="基础">
      <base-resource-panel/>
    </el-tab-panel>
    <el-tab-panel label="资产库" name="资产库">
      <asseel-library/>
    </el-tab-panel>
  </el-tabs>
</template>

<style scoped>

</style>