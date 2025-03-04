<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import {isAmbientLight} from "three-is";
import * as THREE from "three";
import {BoolItem, ColorItem, TextItem, Vector3Item} from "../../../../common-ui";
import {ElForm} from "element-plus";
import {useAttributeProvide, useBus} from "../../../../hooks";
import {set} from "lodash-es";

const bus = useBus();

onMounted(() => {

  const viewer = bus.viewer;
  if (!viewer) return;
  viewer.editor.editorEventManager.objectSelected.subscribe(() => {
    threeToUi()
  })
  threeToUi()
})
const form = reactive({
  type: "",
  uuid: "",
  name: '',
  position: {x: 11, y: 0, z: 0},
  intensity: 0,
  color: "",
  visible: false,
  frustumCulled: false,
  renderOrder: 0,
})

const threeToUi = () => {
  const object = bus.selectObject;
  if (!isAmbientLight(object)) return

  form.type = "环境光"
  form.uuid = object.uuid
  form.name = object.name

  form.position.x = object.position.x;
  form.position.y = object.position.y;
  form.position.z = object.position.z;

  form.intensity = object.intensity
  form.color = `#${object.color.getHexString()}`
  form.visible = object.visible
  form.frustumCulled = object.frustumCulled
  form.renderOrder = object.renderOrder
}

const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {

  const {name, value} = editValue;
  const object = bus.selectObject as THREE.AmbientLight;
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
    <bool-item label="可见性" name="visible"/>
    <bool-item label="视锥体裁剪" name="frustumCulled"/>
    <input-number-item label="渲染次序" name="renderOrder"/>
  </el-form>
</template>

<style scoped>

</style>