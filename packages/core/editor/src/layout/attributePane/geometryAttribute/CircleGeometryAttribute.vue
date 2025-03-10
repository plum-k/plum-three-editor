<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isCircleGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isCircleGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.CircleGeometry;
    const newGeometry = new THREE.CircleGeometry(
        form.radius,
        form.segments,
        form.thetaStart * THREE.MathUtils.DEG2RAD,
        form.thetaLength * THREE.MathUtils.DEG2RAD
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
  segments: 0,
  thetaStart: 0,
  thetaLength: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.CircleGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;

  form.radius = geometry.parameters.radius
  form.segments = geometry.parameters.segments
  form.segments = geometry.parameters.thetaStart * THREE.MathUtils.RAD2DEG
  form.thetaLength = geometry.parameters.thetaLength * THREE.MathUtils.RAD2DEG
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="宽度" name="width"/>
    <input-number-item label="分段" name="segments"/>
    <input-number-item label="弧度起点" name="thetaStart"/>
    <input-number-item label="弧度长度" name="thetaLength"/>
  </el-form>
</template>

<style scoped>

</style>