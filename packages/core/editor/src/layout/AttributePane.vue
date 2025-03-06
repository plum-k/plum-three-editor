<script lang="ts" setup>
import {ElScrollbar, ElTabPane, ElTabs} from 'element-plus'
import GeometryAttribute from "./attributePane/GeometryAttribute.vue";
import MaterialAttribute from "./attributePane/MaterialAttribute.vue";
import SceneAttribute from "./attributePane/SceneAttribute.vue";
import {ObjectAttribute} from "./attributePane";
import PostProcessing from "./attributePane/PostProcessing.vue";
import {useProvideRef} from "../hooks/useProvideRef.ts";


const activeName = useProvideRef("tabActiveName", '场景');
</script>

<template>
  <el-tabs v-model="activeName" :tab-position="'left'" class="h-full">
    <el-tab-pane label="属性" name="属性">
      <el-scrollbar class="h-full">
        <object-attribute tab-name="属性"/>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="几何" name="几何">
      <el-scrollbar class="h-full">
        <geometry-attribute tab-name="几何"/>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane class="e-tabs h-full" label="材质" name="材质">
      <el-scrollbar class="h-full">
        <material-attribute tabName="材质"/>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="场景" name="场景">
      <el-scrollbar class="h-full">
        <scene-attribute tabName="场景"/>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="后期" name="后期">
      <el-scrollbar class="h-full">
        <post-processing tabName="后期"/>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}

</style>