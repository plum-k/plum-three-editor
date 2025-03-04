<script lang="ts" setup>
import {ElTabs} from "element-plus";
import {ref} from "vue";

const activeName = ref('模型')

const handleClick = (tab: any, event: Event) => {

}

</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs" tab-position="left" @tab-click="handleClick">
    <el-tab-panel label="模型" name="模型">
      <asseel-panel activeKey="activeKey" baseName='"models/"'/>
    </el-tab-panel>
    <el-tab-panel label="材质" name="材质">
      <asseel-panel activeKey="activeKey" baseName='"material/"'/>
    </el-tab-panel>
  </el-tabs>
</template>

<style scoped>

</style>