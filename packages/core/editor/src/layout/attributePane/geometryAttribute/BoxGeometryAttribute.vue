<script lang="ts" setup>
import {ElButton, ElDescriptions, ElDescriptionsItem, ElForm} from "element-plus";
import {reactive, ref} from "vue";
import * as THREE from "three";
import {isBoxGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();

const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isBoxGeometry(object.geometry)) {
    threeToUi(object.geometry);
  }
}
const {} = useBindSubscribe(sync);

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide(false)
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
   if (!isMesh(object)) return;
  if (name === 'name') {
    object.name = value;
  } else {
    const geometry = object.geometry as THREE.BoxGeometry;
    const newGeometry = new THREE.BoxGeometry(
        form.width,
        form.height,
        form.depth,
        form.widthSegments,
        form.heightSegments,
        form.depthSegments
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  width: 0,
  height: 0,
  depth: 0,
  widthSegments: 0,
  heightSegments: 0,
  depthSegments: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.BoxGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.width = geometry.parameters.width;
  form.height = geometry.parameters.height;
  form.depth = geometry.parameters.depth;

  form.widthSegments = geometry.parameters.widthSegments;
  form.heightSegments = geometry.parameters.heightSegments;
  form.depthSegments = geometry.parameters.depthSegments;

  getGeometry(geometry)
}

interface IList {
  label: string
  count: number,
  itemSize: number,
}

const list = ref<IList[]>([])
const attributesObject = {
  "position": "位置",
  "normal": "法线",
  "uv": "uv",
}
const getGeometry = (geometry: THREE.BufferGeometry) => {
  if (geometry.index !== null) {
    list.value.push({
      label: '索引',
      count: geometry.index.count,
      itemSize: 0,
    })
  }
  const attributes = geometry.attributes;
  for (const name in attributes) {
    const attribute = attributes[name];
    let {count, itemSize} = attribute
    list.value.push({
      label: Reflect.get(attributesObject, name),
      count: count,
      itemSize: itemSize,
    })
  }
}

const computeVertexNormals = () => {
  const geometry = bus.selectGeometry;
  if (geometry) {
    geometry.computeVertexNormals();
  }
}
const computeVertexTangents = () => {
  // if (geometry) {
  //   geometry.computeVertexTangents();
  // }
}
const showVertexNormals = () => {
  const editor = bus.editor;
  const selectObject = bus.selectObject;
  if (editor && selectObject) {
    editor?.showNormals(selectObject);
  }
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="宽度" name="width"/>
    <input-number-item label="高度" name="height"/>
    <input-number-item label="深度" name="depth"/>

    <input-number-item label="宽度分割数" name="widthSegments"/>
    <input-number-item label="高度分割数" name="heightSegments"/>
    <input-number-item label="深度分割数" name="depthSegments"/>

    <el-descriptions title="属性">
      <el-descriptions-item v-for="item in list" :key="item.label" :label="item.label">
        {{ item.count }} ({{ item.itemSize !== 0 ? item.itemSize : "" }})
      </el-descriptions-item>
    </el-descriptions>

    <el-button text @click="computeVertexNormals">
      计算顶点法线
    </el-button>
    <el-button text @click="computeVertexTangents">
      计算切线
    </el-button>
    <el-button text @click="showVertexNormals">
      显示顶点法线
    </el-button>
  </el-form>
</template>

<style scoped>

</style>