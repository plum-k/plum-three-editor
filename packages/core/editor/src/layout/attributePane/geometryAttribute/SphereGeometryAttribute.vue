<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isMesh, isSphereGeometry} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isSphereGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.SphereGeometry;
    const newGeometry = new THREE.SphereGeometry(
        form.radius,
        form.widthSegments,
        form.heightSegments,
        form.phiStart * THREE.MathUtils.DEG2RAD,
        form.phiLength * THREE.MathUtils.DEG2RAD,
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
  widthSegments: 0,
  heightSegments: 0,
  phiStart: 0,
  phiLength: 0,
  thetaStart: 0,
  thetaLength: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.SphereGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.radius = geometry.parameters.radius
  form.widthSegments = geometry.parameters.widthSegments
  form.heightSegments = geometry.parameters.heightSegments
  form.phiStart = geometry.parameters.phiStart
  form.phiLength = geometry.parameters.phiLength
  form.thetaStart = geometry.parameters.thetaStart
  form.thetaLength = geometry.parameters.thetaLength
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="半径" name="radius"/>
    <input-number-item label="宽度分段" name="widthSegments"/>
    <input-number-item label="高度分段" name="heightSegments"/>
    <input-number-item label="经度起点" name="phiStart"/>
    <input-number-item label="经度长度" name="phiLength"/>
    <input-number-item label="纬度起点" name="thetaStart"/>
    <input-number-item label="纬度长度" name="thetaLength"/>
  </el-form>
</template>

<style scoped>

</style>