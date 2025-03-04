<script lang="ts" setup>
import {ElScrollbar, ElTabs} from 'element-plus'
import {ref} from 'vue'
import GeometryAttribute from "./attributePane/GeometryAttribute.vue";
import MaterialAttribute from "./attributePane/MaterialAttribute.vue";
import SceneAttribute from "./attributePane/SceneAttribute.vue";
import {provide} from "@vue/runtime-core";

const activeName = ref('材质');
provide("tabActiveName", activeName)
</script>

<template>
  <el-tabs v-model="activeName" :tab-position="'left'" class="h-full">
    <el-tab-panel label="属性" name="属性">
      <el-scrollbar class="h-full">
        <objecel-attribute tab-name="属性"/>
      </el-scrollbar>
    </el-tab-panel>
    <el-tab-panel label="几何" name="几何">
      <el-scrollbar class="h-full">
        <geometry-attribute tab-name="几何"/>
      </el-scrollbar>
    </el-tab-panel>
    <el-tab-panel class="e-tabs h-full" label="材质" name="材质">
      <el-scrollbar class="h-full">
        <material-attribute tabName="材质"/>
      </el-scrollbar>
    </el-tab-panel>
    <el-tab-panel label="场景" name="场景">
      <el-scrollbar class="h-full">
        <scene-attribute/>
      </el-scrollbar>
    </el-tab-panel>
  </el-tabs>
</template>

<style scoped>
:deep(.el-tab-panel) {
  height: 100%;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

</style>