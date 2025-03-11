<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();

const sync = () => {
  const object = bus.selectObject;
  if (isMesh(object)) {
    threeToUi(object.geometry as THREE.BufferGeometry);
  }
}

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide({
  isAutoUpdate: false,
  getObject: () => {
    return bus.selectObject!.geometry as any;
  }
})
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!isMesh(object)) return;
  if (name === 'name') {
    object.name = value;
  } else {
  }
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  curveSegments: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.BufferGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
}

</script>

<template>
  <el-form label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
  </el-form>
</template>

<style scoped>

</style>