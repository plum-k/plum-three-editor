<script lang="ts" setup>
import * as THREE from "three";
import {Viewer} from "@plum-render/three-sdk";
import {ElTreeV2, type TreeNode, type TreeNodeData,ElButton,ElIcon} from "element-plus";
import {ref} from "vue";
import {useBus} from "../../hooks";
import ContextMenu from '@imengyu/vue3-context-menu'
import Icon from "../../components/Icon.vue";

const bus = useBus();

// 将 THREE 对象转换为树节点
const getTree = (objects: Array<THREE.Object3D>) => {
  const nodes: Array<any> = [];
  for (let i = 0, l = objects.length; i < l; i++) {
    const object = objects[i];
    const {name, uuid, children, type, visible} = object;
    const _name = name === "" ? type : name; // 如果名称为空则使用类型
    console.log(visible)
    let node: any = {
      visible,
      label: _name,
      id: uuid,
      children: [],
    };
    if (children.length !== 0) {
      node.children = getTree(children); // 递归获取子节点
    }
    nodes.push(node);
  }
  return nodes;
}
// 获取场景树
const getSceneTree = (viewer: Viewer) => {
  const scene = viewer.scene;
  return getTree(scene.children);
}

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  data.value = getSceneTree(viewer!);

  viewer?.editor.editorEventManager.sceneGraphChanged.subscribe(() => {
    console.log("便阿虎11111111111")
    data.value = getSceneTree(viewer!);
  })
})

const data = ref<Array<any>>([]);

const handleNodeClick = (data: TreeNodeData, node: TreeNode, e: MouseEvent) => {
  const viewer = bus.viewer;
  if (viewer) {
    const id = data.id;
    const object = viewer.getObjectByUuid(id);
    if (object) {
      viewer.editor.selector.select(object);
    }
  }
}
const handleNodeContextmenu = (evt: Event, data: TreeNodeData, node: TreeNode) => {
  const viewer = bus.viewer;
  if (viewer?.scene) {
    const id = data.id;
    const object = viewer?.getObjectByUuid(id);
    if (object) {
      const visible = object.visible;
      ContextMenu.showContextMenu({
        x: (evt as MouseEvent).x,
        y: (evt as MouseEvent).y,
        items: [
          {
            label: visible ? "隐藏" : "显示",
            onClick: () => {
              // todo 记录历史
              object.visible = !visible;
            }
          },
          {
            label: "删除",
            onClick: () => {
              viewer?.editor.removeObjectExecute(object);
            }
          },
        ]
      });
    }

  }
}

</script>

<template>
  <el-tree-v2
      :data="data"
      class="h-full"
      @node-click="handleNodeClick"
      @node-contextmenu="handleNodeContextmenu"
  >
    <template #default="{ node }">
      <icon v-if="node.data.visible" icon-name="icon-show" />
      <icon v-else icon-name="icon-hide" />
      <span>{{ node.label }}</span>
    </template>
  </el-tree-v2>
</template>

<style scoped>

</style>