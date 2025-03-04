<script lang="ts" setup>
import {ref} from "vue";
import {ElTabPane, ElTabs} from 'element-plus'
import AssetPanel from "./AssetPanel.vue";

const activeName = ref('模型')

const handleClick = (tab: any, event: Event) => {

}

</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" tab-position="left" @tab-click="handleClick">
    <el-tab-pane label="模型" name="模型">
      <asset-panel activeKey="activeKey" baseName='"models/"'/>
    </el-tab-pane>
    <el-tab-pane label="材质" name="材质">
      <asset-panel activeKey="activeKey" baseName='"material/"'/>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>