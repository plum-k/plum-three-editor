<script lang="ts" setup>
import {ElTabPane, ElTabs} from 'element-plus'
import {ref} from 'vue'
import {AssetLibrary, BaseResourcePanel} from "./resourcePanel";

const activeName = ref('基础')

const handleClick = (tab: any, event: Event) => {

}

</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="基础" name="基础">
      <base-resource-panel/>
    </el-tab-pane>
    <el-tab-pane label="资产库" name="资产库">
      <asset-library/>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>