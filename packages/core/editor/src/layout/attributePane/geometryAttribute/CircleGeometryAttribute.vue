<script lang="ts" setup>
import {ElForm} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputNumberItem, TextItem} from "../../../common-ui";
import {useActiveTab} from "../../../hooks/useActiveTab.ts";

const bus = useBus();

const {isActive} = useActiveTab("几何")
const isVisible = ref(false);

onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();

  viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
    sync();
  })
})

const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isActive.value) {
    isVisible.value = true;
    threeToUi(object.geometry as THREE.CircleGeometry);
  } else {
    isVisible.value = false;
  }
}

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  if (!isMesh(object)) return;
  if (!isActive.value) return;
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
  <el-form :model="form" label-position="left" label-width="auto" size="small">
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