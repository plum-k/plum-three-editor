<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isLatheGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isLatheGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.LatheGeometry;
    const newGeometry = new THREE.LatheGeometry(
        [],
        form.segments,
        form.phiStart * THREE.MathUtils.DEG2RAD,
        form.phiLength * THREE.MathUtils.DEG2RAD
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }

})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  segments: 0,
  phiStart: 0,
  phiLength: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.LatheGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.segments = geometry.parameters.segments
  form.phiStart = geometry.parameters.phiStart * THREE.MathUtils.RAD2DEG
  form.phiLength = geometry.parameters.phiLength * THREE.MathUtils.RAD2DEG
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="分段" name="segments"/>
    <input-number-item label="经度起点" name="phiStart"/>
    <input-number-item label="经度长度" name="phiLength"/>
  </el-form>
</template>

<style scoped>

</style>