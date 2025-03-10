<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh, isTorusKnotGeometry} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isTorusKnotGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.TorusKnotGeometry;
    const newGeometry = new THREE.TorusKnotGeometry(
        form.radius,
        form.tube,
        form.tubularSegments,
        form.radialSegments,
        form.p,
        form.q
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
  tube: 0,
  tubularSegments: 0,
  radialSegments: 0,
  p: 0,
  q: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.TorusKnotGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.radius = geometry.parameters.radius
  form.tube = geometry.parameters.tube
  form.tubularSegments = geometry.parameters.tubularSegments
  form.radialSegments = geometry.parameters.radialSegments
  form.radialSegments = geometry.parameters.p
  form.q = geometry.parameters.q
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="半径" name="radius"/>
    <input-number-item label="管厚" name="tube"/>
    <input-number-item label="管厚分段" name="tubularSegments"/>
    <input-number-item label="半径分段" name="radialSegments"/>
    <input-number-item label="管长弧度" name="p"/>
    <input-number-item label="扭曲弧度" name="q"/>
  </el-form>
</template>

<style scoped>

</style>