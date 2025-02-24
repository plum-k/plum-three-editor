<script setup lang="ts">
import {ElRow,ElCol}   from "element-plus";
import EHeader from "../components/editor/EHeader.vue";
import SceneTree from "../components/editor/SceneTree.vue";



</script>

<template>
  <EHeader/>
  <el-row :gutter="20">
    <el-col :span="6">
      <SceneTree/>
    </el-col>
    <el-col :span="12">

    </el-col>
    <el-col :span="6">

    </el-col>
  </el-row>
</template>

<style scoped>

</style>