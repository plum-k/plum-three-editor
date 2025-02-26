<script setup lang="ts">
import {ElTabPane, ElTabs,ElScrollbar} from 'element-plus'
import {ref} from 'vue'
import ObjectAttribute from "./attributePane/ObjectAttribute.vue";
import GeometryAttribute from "./attributePane/GeometryAttribute.vue";
import MaterialAttribute from "./attributePane/MaterialAttribute.vue";
import SceneAttribute from "./attributePane/SceneAttribute.vue";

const activeName = ref('材质');
</script>

<template>
  <el-tabs :tab-position="'left'" class="h-full" v-model="activeName">
    <el-tab-pane label="属性" name="属性">
      <el-scrollbar class="h-full">
        <object-attribute/>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="几何" name="几何">
      <el-scrollbar class="h-full">
        <geometry-attribute/>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="材质" name="材质" class="e-tabs h-full" >
        <el-scrollbar class="h-full">
          <material-attribute/>
        </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="场景" name="场景">
      <el-scrollbar class="h-full">
        <scene-attribute/>
      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-scrollbar__view){
  height: 100%;
}

</style>