<script lang="ts" setup>
import {ElMenu, ElMenuItem, ElSubMenu} from "element-plus";
import {ref} from "vue";
import {useBus} from "../../hooks";
import {ChunkSerialize} from "@plum-render/three-sdk/src/serializeManage/package";

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const bus = useBus();
const test1 = () => {
  console.log("11")
  const viewer = bus.viewer;
  if(!viewer) return
  const chunkSerialize = new ChunkSerialize({viewer});
  chunkSerialize.pack();
}
</script>

<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo w-2xl"
      mode="horizontal"
      @select="handleSelect"
  >
    <el-menu-item index="1">测试</el-menu-item>
    <el-sub-menu index="2">
      <template #title>文件</template>
      <el-menu-item index="2-1">分包</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>导出</template>
        <el-menu-item index="2-4-1" @click="test1">分包1</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>