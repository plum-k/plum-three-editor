<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh, isRingGeometry} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isRingGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.RingGeometry;
    const newGeometry = new THREE.RingGeometry(
        form.innerRadius,
        form.outerRadius,
        form.thetaSegments,
        form.phiSegments,
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
  innerRadius: 0,
  outerRadius: 0,
  thetaSegments: 0,
  phiSegments: 0,
  thetaStart: 0,
  thetaLength: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.RingGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.innerRadius = geometry.parameters.innerRadius
  form.outerRadius = geometry.parameters.outerRadius
  form.outerRadius = geometry.parameters.thetaSegments
  form.phiSegments = geometry.parameters.phiSegments
  form.thetaStart = geometry.parameters.thetaStart
  form.thetaLength = geometry.parameters.thetaLength
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="内半径" name="innerRadius"/>
    <input-number-item label="外半径" name="outerRadius"/>
    <input-number-item label="弧度分段" name="thetaSegments"/>
    <input-number-item label="经度分段" name="phiSegments"/>
    <input-number-item label="弧度起点" name="thetaStart"/>
    <input-number-item label="弧度长度" name="thetaLength"/>
  </el-form>
</template>

<style scoped>

</style>