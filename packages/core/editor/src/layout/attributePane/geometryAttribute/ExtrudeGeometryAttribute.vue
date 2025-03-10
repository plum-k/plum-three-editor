<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import * as THREE from "three";
import {isExtrudeGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, TextItem} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();


const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isExtrudeGeometry(object.geometry)) {
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
    const geometry = object.geometry as THREE.ExtrudeGeometry;
    const newGeometry = new THREE.ExtrudeGeometry(

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
const threeToUi = (geometry: THREE.ExtrudeGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;

}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

  </el-form>
</template>

<style scoped>

</style>