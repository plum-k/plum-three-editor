<script lang="ts" setup>
import {ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu} from "element-plus";
import {useBus} from "../../hooks";
import {ChunkSerialize, ExporterTool} from "@plum-render/three-sdk";
import {isMesh} from "three-is";

const bus = useBus();
const save = () => {
  const viewer = bus.viewer;
  if (!viewer) return
  const chunkSerialize = new ChunkSerialize({viewer});
  chunkSerialize.pack();
}
const chunkExport = () => {
  const viewer = bus.viewer;
  if (!viewer) return
  const chunkSerialize = new ChunkSerialize({viewer});
  chunkSerialize.pack();
}

enum FileFormat {
  DRC = "DRC",
  GLB = "GLB",
  GLTF = "GLTF",
  OBJ = "OBJ",
  PLY = "PLY",
  PLY_BINARY = "PLY (BINARY)",
  STL = "STL",
  STL_BINARY = "STL (BINARY)",
  USDZ = "USDZ"
}

const handleExport = (format: FileFormat) => {
  console.log(`导出为 ${format} 格式`);
  const viewer = bus.viewer;
  const exporterTool = ExporterTool.getInstance();
  switch (format) {
    case FileFormat.DRC: {
      const object = viewer?.editor.selector.selectObject
      if (isMesh(object)) {
        exporterTool.exportDRC(object)
      }
      break;
    }
    case FileFormat.GLB: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportGLB(object, {
          binary: true,
        })
      }
      break;
    }
    case FileFormat.GLTF: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportGLB(object)
      }
      break;
    }
    case FileFormat.OBJ: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportOBJ(object)
      }
      break;
    }
    case FileFormat.PLY: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportPLY(object)
      }
      break;
    }
    case FileFormat.PLY_BINARY: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportPLY(object, {
          binary: true,
        })
      }
      break;
    }
    case FileFormat.STL: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportSTL(object)
      }
      break;
    }
    case FileFormat.STL_BINARY: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportSTL(object, {
          binary: true,
        })
      }
      break;
    }
    case FileFormat.USDZ: {
      const object = viewer?.scene
      if (object) {
        exporterTool.exportUSDZ(object)
      }
      break;
    }
  }
};
</script>

<template>
  <el-dropdown placement="bottom">
    <el-button size="small" text> 文件</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="save">保存</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu>
        <el-dropdown-item>导出原生</el-dropdown-item>
        <el-dropdown-item @click="chunkExport">导出分包</el-dropdown-item>
        <el-dropdown-item>导出渐进</el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu>
        <el-dropdown-item v-for="(value, key) in FileFormat" :key="key" @click="handleExport(value)">{{ value }}
        </el-dropdown-item>
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