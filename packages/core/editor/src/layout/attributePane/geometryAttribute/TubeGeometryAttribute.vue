<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh, isTubeGeometry} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {BoolItem, InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();

const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isTubeGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.TubeGeometry;
    const newGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(),
        form.tubularSegments,
        form.radius,
        form.radialSegments,
        form.closed
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  tubularSegments: 0,
  radius: 0,
  radialSegments: 0,
  closed: false
});

// ui -> three
const threeToUi = (geometry: THREE.TubeGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.tubularSegments = geometry.parameters.tubularSegments
  form.radius = geometry.parameters.radius
  form.radialSegments = geometry.parameters.radialSegments
  form.closed = geometry.parameters.closed
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="管厚分段" name="tubularSegments"/>
    <input-number-item label="半径" name="radius"/>
    <input-number-item label="半径分段" name="radialSegments"/>

    <bool-item label="闭合" name="closed"/>
  </el-form>
</template>

<style scoped>

</style>