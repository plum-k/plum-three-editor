<script lang="ts" setup>
import {ElMenu, ElMenuItem, ElButton,ElDropdown, ElDropdownMenu, ElDropdownItem} from "element-plus";
import {ref} from "vue";
import {useBus} from "../../hooks";
import {ChunkSerialize} from "@plum-render/three-sdk";

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const bus = useBus();
const chunkExport = () => {
  console.log("11")
  const viewer = bus.viewer;
  if(!viewer) return
  const chunkSerialize = new ChunkSerialize({viewer});
  chunkSerialize.pack();
}
</script>

<template>
  <el-dropdown placement="bottom">
    <el-button> 文件 </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>导出原生</el-dropdown-item>
        <el-dropdown-item @click="chunkExport">导出分包</el-dropdown-item>
        <el-dropdown-item>导出渐进</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>