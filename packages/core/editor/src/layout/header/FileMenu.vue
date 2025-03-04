<script lang="ts" setup>
import {Button as TButton, Dropdown as TDropdown, type DropdownProps, MessagePlugin} from 'tdesign-vue-next';

import {useBus} from "../../hooks";
import {ChunkSerialize, ExporterTool} from "@plum-render/three-sdk";
import {isMesh} from "three-is";

const bus = useBus();

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

const options: DropdownProps['options'] = [
  {
    content: '保存',
    value: 1,
  },
  {
    content: '导出场景包',
    value: 2,
    children: [
      {
        content: '原生',
        value: 5,
      },
      {
        content: '压缩',
        value: 6,
      },
      {
        content: '分包',
        value: 6,
      },
    ],
  },
  {
    content: '导出模型',
    value: '导出模型',
    children: [
      {content: FileFormat.DRC, value: FileFormat.DRC},
      {content: FileFormat.GLB, value: FileFormat.GLB},
      {content: FileFormat.GLTF, value: FileFormat.GLTF},
      {content: FileFormat.OBJ, value: FileFormat.OBJ},
      {content: FileFormat.PLY, value: FileFormat.PLY},
      {content: FileFormat.PLY_BINARY, value: FileFormat.PLY_BINARY},
      {content: FileFormat.STL, value: FileFormat.STL},
      {content: FileFormat.STL_BINARY, value: FileFormat.STL_BINARY},
      {content: FileFormat.USDZ, value: FileFormat.USDZ}
    ]
  }
];
const clickHandler: DropdownProps['onClick'] = (data) => {
  console.log(data)
  MessagePlugin.success(`选中【${data.content}】`);

  const viewer = bus.viewer;
  const exporterTool = ExporterTool.getInstance();
  switch (data.content) {
    case "保存": {
      const viewer = bus.viewer;
      if (!viewer) return
      const chunkSerialize = new ChunkSerialize({viewer});
      chunkSerialize.pack();
      break;
    }
    case "原生": {
      break;
    }
    case "压缩": {
      break;
    }
    case "分包": {
      break;
    }
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
  <t-dropdown :max-column-width="120" :options="options" @click="clickHandler">
    <t-button variant="text">
      文件
    </t-button>
  </t-dropdown>
</template>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>