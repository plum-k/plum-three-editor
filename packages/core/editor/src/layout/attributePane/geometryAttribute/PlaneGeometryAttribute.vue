<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh, isPlaneGeometry} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isPlaneGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.PlaneGeometry;
    const newGeometry = new THREE.PlaneGeometry(
        form.width,
        form.height,
        form.widthSegments,
        form.heightSegments,
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
  widthSegments: 0,
  heightSegments: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.PlaneGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.width = geometry.parameters.width
  form.height = geometry.parameters.height
  form.widthSegments = geometry.parameters.widthSegments
  form.heightSegments = geometry.parameters.heightSegments
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="宽度" name="width"/>
    <input-number-item label="高度" name="height"/>

    <input-number-item label="宽度分割数" name="widthSegments"/>
    <input-number-item label="高度分割数" name="heightSegments"/>
  </el-form>
</template>

<style scoped>

</style>