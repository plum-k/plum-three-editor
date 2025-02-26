<script setup lang="ts">
import {ElTabPane, ElTabs} from "element-plus";
import {ref} from "vue";
import AssetPanel from "./AssetPanel.vue";

const activeName = ref('模型')

const handleClick = (tab: any, event: Event) => {
  console.log(tab, event)
}

</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="模型" name="模型">
      <asset-panel baseName='"models/"' activeKey="activeKey"/>
    </el-tab-pane>
    <el-tab-pane label="材质" name="材质">
      <asset-panel baseName='"material/"' activeKey="activeKey"/>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>