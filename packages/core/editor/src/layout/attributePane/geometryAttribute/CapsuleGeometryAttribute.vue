<script lang="ts" setup>
import {ElForm} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useActiveTab} from "../../../hooks/useActiveTab.ts";

const bus = useBus();

const {isActive} = useActiveTab("几何")
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
    threeToUi(object.geometry as THREE.CapsuleGeometry);
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
    const geometry = object.geometry as THREE.CapsuleGeometry;
    const newGeometry = new THREE.CapsuleGeometry(
        form.radius,
        form.length,
        form.capSegments,
        form.radialSegments,
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }

})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  radius: 0,
  length: 0,
  capSegments: 0,
  radialSegments: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.CapsuleGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.radius = geometry.parameters.radius;
  form.length = geometry.parameters.length;
  form.capSegments = geometry.parameters.capSegments;
  form.radialSegments = geometry.parameters.radialSegments;
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="auto" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="radius" name="半径"/>
    <input-number-item label="length" name="长度"/>
    <input-number-item label="capSegments" name="切片数"/>
    <input-number-item label="radialSegments" name="切片数"/>
  </el-form>
</template>

<style scoped>

</style>