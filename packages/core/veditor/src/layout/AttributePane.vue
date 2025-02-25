<script setup lang="ts">
import {ElTabPane, ElTabs} from 'element-plus'
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
      <div class="h-full overflow-auto">
        <object-attribute/>
      </div>
    </el-tab-pane>
    <el-tab-pane label="几何" name="几何">
      <div class="h-full overflow-auto">
        <geometry-attribute/>
      </div>
    </el-tab-pane>
    <el-tab-pane label="材质" name="材质">
      <div class="h-full overflow-auto">
        <material-attribute/>
      </div>
    </el-tab-pane>
    <el-tab-pane label="场景" name="场景">
      <div class="h-full overflow-auto">
        <scene-attribute/>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>