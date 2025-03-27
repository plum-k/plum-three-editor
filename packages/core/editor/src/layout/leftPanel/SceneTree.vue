<script lang="ts" setup>
import {Viewer} from "@plum-render/three-sdk";
import {ElTreeV2, type TreeNode, type TreeNodeData} from "element-plus";
import {ref} from "vue";
import {useBus} from "../../hooks";
import ContextMenu from '@imengyu/vue3-context-menu'
import Icon from "../../components/Icon.vue";
import {isNil} from "lodash-es";
import {isDirectionalLight} from "three-is";
import {Object3D} from "three";

const bus = useBus();

// 将 THREE 对象转换为树节点
const getTree = (objects: Array<Object3D>) => {
  const nodes: Array<any> = [];
  for (let i = 0, l = objects.length; i < l; i++) {
    const object = objects[i];
    const {name, uuid, children, type, visible} = object;
    const _name = name === "" ? type : name; // 如果名称为空则使用类型

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

let htmlRef: HTMLElement | null = null
const height = ref(200);
const treeRef = ref()
const setHeight = () => {
  if (isNil(htmlRef)) {
    htmlRef = document.getElementById("sceneTree")!
  }
  height.value = htmlRef.clientHeight;
}


bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  treeData.value = getSceneTree(viewer!);
  setHeight();
  viewer?.editor.editorEventManager.sceneGraphChanged.subscribe(() => {
    treeData.value = getSceneTree(viewer!);
    setHeight();
  })

  viewer?.editor.editorEventManager.objectChanged.subscribe((value) => {
    const {name} = value
    if (name === "name") {
      treeData.value = getSceneTree(viewer!);
    }
  })
})

const treeData = ref<Array<any>>([]);

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
      const hasOutline = viewer?.postProcessingComponent.objectHasOutline(object);
      const hasSelectiveBloomEffectObject = viewer?.postProcessingComponent.hasSelectiveBloomEffectObject(object);

      ContextMenu.showContextMenu({
        x: (evt as MouseEvent).x,
        y: (evt as MouseEvent).y,
        items: [
          {
            label: visible ? "隐藏" : "显示",
            onClick: () => {
              viewer?.editor.setValueExecute(object, "visible", !visible);
              treeData.value = getSceneTree(viewer);
              console.log(treeData.value)
            }
          },
          {
            label: "删除",
            onClick: () => {
              viewer?.editor.removeObjectExecute(object);
            }
          },
          {
            label: hasOutline ? "取消描边" : "描边",
            onClick: () => {
              hasOutline ? viewer?.postProcessingComponent.removeOutlineObject(object) : viewer?.postProcessingComponent.addOutlineObject(object);
            }
          },
          {
            label: hasSelectiveBloomEffectObject ? "取消辉光" : "辉光",
            onClick: () => {
              hasSelectiveBloomEffectObject ? viewer?.postProcessingComponent.removeSelectiveBloomEffectObject(object) : viewer?.postProcessingComponent.addSelectiveBloomEffectObject(object);
            }
          },
        ]
      });
    }
  }
}

const fitMesh = (data: any) => {
  const viewer = bus.viewer;
  if (viewer) {
    const id = data.id;
    const object = viewer.getObjectByUuid(id);
    if (object) {
      if (isDirectionalLight(object)) {
      } else {
        viewer.cameraManager.fitToMeshBySphere([object], true);
      }
    }
  }
}
const aa = (ccc) => {
  console.log("111", ccc)

}
</script>

<template>
  <el-tree-v2
      id="sceneTree"
      ref="treeRef"
      :data="treeData"
      :height="height"
      :highlight-current="true"
      class="h-full"
      @node-click="handleNodeClick"
      @node-contextmenu="handleNodeContextmenu"
  >
    <template #default="{ node }">
      <icon v-if="node.data.visible" icon-name="icon-show" @click="aa(node.data)"/>
      <icon v-else icon-name="icon-hide" @click="aa(node.data)"/>
      <span class="m-1 select-none" @dblclick="fitMesh(node.data)">{{ node.label }}</span>
    </template>
  </el-tree-v2>
</template>

<style scoped>

</style>