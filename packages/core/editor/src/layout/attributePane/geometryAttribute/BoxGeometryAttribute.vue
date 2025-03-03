<script lang="ts" setup>
import {ElForm} from "element-plus";
import {computed, inject, onMounted, reactive, ref} from "vue";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";

const bus = useBus();

const tabActiveName = inject("tabActiveName", ref("几何"))

const isActive = computed(() => {
  return tabActiveName.value === "几何"
})
const isVisible = ref(false);

onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();

  viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
    sync();
  })
})

const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isActive.value) {
    isVisible.value = true;
    threeToUi(object.geometry as THREE.BoxGeometry);
  } else {
    isVisible.value = false;
  }
}

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  if (!isMesh(object)) return;
  if (!isActive.value) return;
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
}
const items = useMemo(() => {
  let list = []
  if (geometry) {
    if (geometry.index !== null) {
      list.push({
        key: '0',
        label: '索引',
        children: geometry.index.count,
      })
    }
    const attributes = geometry.attributes;
    for (const name in attributes) {
      const attribute = attributes[name];
      console.log(name)

      let {count, itemSize} = attribute

      list.push({
        key: nameMap.get(name),
        label: nameMap.get(name),
        children: `${count}(${count / itemSize}*${itemSize})`,
      })
    }

  }
  return list
}, [geometry])
属性

geometry.computeVertexNormals();
计算顶点法线

editor?.showNormals(selectObject3D as THREE.Object3D);
显示顶点法线
</script>

<template>
  <el-form :model="form" label-position="left" label-width="auto" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="宽度" name="width"/>
    <input-number-item label="高度" name="height"/>
    <input-number-item label="深度" name="depth"/>

    <input-number-item label="宽度分割数" name="widthSegments"/>
    <input-number-item label="高度分割数" name="heightSegments"/>
    <input-number-item label="深度分割数" name="depthSegments"/>
  </el-form>
</template>

<style scoped>

</style>