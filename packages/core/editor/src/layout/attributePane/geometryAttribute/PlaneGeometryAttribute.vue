<script lang="ts" setup>
import {ElForm} from "element-plus";
import {computed, inject, onMounted, reactive, ref} from "vue";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {InputItem, InputNumberItem, TextItem} from "../../../common-ui";

const bus = useBus();

const tabActiveName = inject("tabActiveName", ref("几何"))

const isActive = computed(() => {
  return tabActiveName.value === "几何"
})
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
    threeToUi(object.geometry as THREE.PlaneGeometry);
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
    const geometry = object.geometry as THREE.PlaneGeometry;
    const newGeometry = new THREE.PlaneGeometry(
        form.width,
        form.height,
        form.widthSegments,
        form.heightSegments,
    );
    // object.geometry.dispose();
    geometry.copy(newGeometry);
  }

})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  width: 0,
  height: 0,
  widthSegments: 0,
  heightSegments: 0,
});

// ui -> three
const threeToUi = (geometry: THREE.PlaneGeometry) => {
  form.type = geometry.type;
  form.uuid = geometry.uuid;
  form.name = geometry.name;
  form.width = geometry.parameters.width
  form.height = geometry.parameters.height
  form.widthSegments = geometry.parameters.widthSegments
  form.heightSegments = geometry.parameters.heightSegments
}

</script>

<template>
  <el-form :model="form" label-position="left" label-width="auto" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <input-number-item label="宽度" name="width"/>
    <input-number-item label="高度" name="height"/>

    <input-number-item label="宽度分割数" name="widthSegments"/>
    <input-number-item label="高度分割数" name="heightSegments"/>
  </el-form>
</template>

<style scoped>

</style>