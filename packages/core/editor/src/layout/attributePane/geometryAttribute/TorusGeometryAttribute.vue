<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh, isTorusGeometry} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isTorusGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.TorusGeometry;
    const newGeometry = new THREE.TorusGeometry(
        form.radius,
        form.tube,
        form.radialSegments,
        form.tubularSegments,
        form.arc * THREE.MathUtils.DEG2RAD
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
  radialSegments: 0,
  tubularSegments: 0,
  arc: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.TorusGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.radius = geometry.parameters.radius
  form.tube = geometry.parameters.tube
  form.radialSegments = geometry.parameters.radialSegments
  form.tubularSegments = geometry.parameters.tubularSegments
  form.arc = geometry.parameters.arc
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="半径" name="radius"/>
    <input-number-item label="管厚" name="tube"/>
    <input-number-item label="半径分段" name="radialSegments"/>
    <input-number-item label="管厚分段" name="tubularSegments"/>
    <input-number-item label="弧度" name="arc"/>
  </el-form>
</template>

<style scoped>

</style>