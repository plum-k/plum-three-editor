<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isCircleGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
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
    const geometry = object.geometry as THREE.CylinderGeometry;
    const newGeometry = new THREE.CylinderGeometry(
        form.radiusTop,
        form.radiusBottom,
        form.height,
        form.radialSegments,
        form.heightSegments,
        form.openEnded
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }

})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  radiusTop: 0,
  radiusBottom: 0,
  height: 0,
  radialSegments: 0,
  heightSegments: 0,
  openEnded: false,
  thetaStart: 0,
  thetaLength: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.CylinderGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.radiusTop = geometry.parameters.radiusTop
  form.radiusBottom = geometry.parameters.radiusBottom
  form.height = geometry.parameters.height
  form.radialSegments = geometry.parameters.radialSegments
  form.heightSegments = geometry.parameters.heightSegments
  form.openEnded = geometry.parameters.openEnded
  form.thetaStart = geometry.parameters.thetaStart
  form.thetaLength = geometry.parameters.thetaLength
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="顶部半径" name="radiusTop"/>
    <input-number-item label="底部半径" name="radiusBottom"/>
    <input-number-item label="高度" name="height"/>
    <input-number-item label="径向分段" name="radialSegments"/>
    <input-number-item label="径向分段" name="heightSegments"/>
    <input-number-item label="开启" name="openEnded"/>

    <input-number-item label="弧度起点" name="thetaStart"/>
    <input-number-item label="弧度长度" name="thetaLength"/>
  </el-form>
</template>

<style scoped>

</style>