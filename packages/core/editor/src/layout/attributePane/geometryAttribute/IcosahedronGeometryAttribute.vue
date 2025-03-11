<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isIcosahedronGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import {getGeometryValue} from "../../../hooks/useGeometryAttributeProvide.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isIcosahedronGeometry(object.geometry)) {
    threeToUi(object.geometry);
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
    const geometry = object.geometry as THREE.IcosahedronGeometry;
    const newGeometry = new THREE.IcosahedronGeometry(
        getGeometryValue(geometry, "radius", name, value),
        getGeometryValue(geometry, "detail", name, value),
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }

})
const form = reactive({
  type: '',
  uuid: '',
  name: '',

});

// ui -> three
const threeToUi = (geometry: THREE.IcosahedronGeometry) => {
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

    <input-number-item :name="['parameters','radius']" label="半径"/>
    <input-number-item :name="['parameters','detail']" label="细节"/>
  </el-form>
</template>

<style scoped>

</style>