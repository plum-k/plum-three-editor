<script setup lang="ts">
import * as THREE from "three";
import {Viewer} from "@plum-render/three-sdk";
import {ElTreeV2} from "element-plus";
import {ref} from "vue";
import {useBus} from "../../hooks/useViewer.ts";

// 将 THREE 对象转换为树节点
const getTree = (objects: Array<THREE.Object3D>) => {
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
const bus = useBus();

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  data.value = getSceneTree(viewer!);
})

const data = ref<Array<any>>([]);

</script>

<template>
  <el-tree-v2
      class="h-full"
      :data="data"
  />
</template>

<style scoped>

</style>