<script setup lang="ts">
import type {TabsInstance} from 'element-plus'
import {ElTabPane, ElTabs} from 'element-plus'
import {ref} from 'vue'
import ObjectAttribute from "./attributePane/ObjectAttribute.vue";
import GeometryAttribute from "./attributePane/GeometryAttribute.vue";
import MaterialAttribute from "./attributePane/MaterialAttribute.vue";
import SceneAttribute from "./attributePane/SceneAttribute.vue";

</script>

<template>
  <el-tabs :tab-position="'left'" class="h-full">
    <el-tab-pane label="属性" class="h-full">
      <div class="h-full">
        <object-attribute/>

      </div>
    </el-tab-pane>
    <el-tab-pane label="几何">
      <geometry-attribute/>
    </el-tab-pane>
    <el-tab-pane label="材质">
      <material-attribute/>
    </el-tab-pane>
    <el-tab-pane label="场景">
      <scene-attribute/>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>