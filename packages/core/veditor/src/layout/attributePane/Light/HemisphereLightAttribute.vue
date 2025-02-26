<script setup lang="ts">
import {onMounted, reactive} from "vue";
import isDirectionalLight from "three-is/src/lights/isDirectionalLight.ts";
import {isHemisphereLightt, isHemisphereLight, isPointLight, isSpotLight} from "three-is";
import * as THREE from "three";
import {BoolItem, ColorItem, InputItem, InputNumberItem, TextItem, Vector3Item} from "../../../common-ui";
import {ElCheckbox, ElCheckboxGroup, ElEmpty, ElForm, ElFormItem} from "element-plus";
import {useBus} from "../../../hooks";
import {set} from "lodash-es";
const bus = useBus();

onMounted(() => {
  const viewer = bus.viewer;
  const object = bus.selectObject;
  threeToUi(object as THREE.HemisphereLight)
})
const form = reactive({
  type: "",
  uuid: "",
  name: '',
  position: {x: 11, y: 0, z: 0},
  intensity: 0,
  color: "",
  groundColor:"",
  visible: false,
  frustumCulled: false,
  renderOrder: 0,
})

const threeToUi = (object: THREE.HemisphereLight) => {
  form.type = "半球光"
  form.uuid = object.uuid
  form.name = object.name

  form.position.x = object.position.x;
  form.position.y = object.position.y;
  form.position.z = object.position.z;

  form.intensity = object.intensity
  form.color = `#${object.color.getHexString()}`
  form.color = `#${object.groundColor.getHexString()}`

  form.visible = object.visible
  form.frustumCulled = object.frustumCulled
  form.renderOrder = object.renderOrder
}
bus.objectAttributeChangeSubject.subscribe((editValue) => {
  console.log(editValue)
  const {name, value} = editValue;
  const object = bus.selectObject as THREE.HemisphereLight;
  if (!object) return;

  if (name === "color") {
    object.color.setStyle(value)
  } else {
    set(object, name, value);
  }
})

</script>

<template>
  <el-form :model="form" label-width="auto" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <vector3-item label="位置" name="position"/>
    <input-number-item label="强度" name="intensity"/>
    <color-item label="颜色" name="color"/>
    <color-item label="基色" name="groundColor"/>
    <bool-item label="可见性" name="visible"/>
    <bool-item label="视锥体裁剪" name="frustumCulled"/>
    <input-number-item label="渲染次序" name="renderOrder"/>
  </el-form>
</template>

<style scoped>

</style>