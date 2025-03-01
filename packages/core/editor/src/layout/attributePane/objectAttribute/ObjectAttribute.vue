<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import {ElEmpty} from "element-plus";
import {useAttributeProvide, useBus} from "../../../hooks";
import * as THREE from "three";
import {isGroup, isLight, isMesh, isObject3D} from "three-is";
import {type AttributePaneNameProps, useAttributePane} from "../useAttributePane.ts";
import LightAttribute from "./Light/LightAttribute.vue";
import Object3DAttribute from "./Object3DAttribute.vue";

const bus = useBus();
const props = defineProps<AttributePaneNameProps>();
const {isActive} = useAttributePane(props)

const isVisible = ref(false);

const show = reactive({
  isLight: false,
  isMesh: false,
  isGroup: false,
  isObject3D: false,
})


watch(isActive, () => {
  sync();
})

const sync = () => {
  const object = bus.selectObject;
  if (object && isActive.value) {
    isVisible.value = true;
    show.isLight = isLight(object);
    show.isMesh = isMesh(object);
    show.isGroup = isGroup(object);
    show.isObject3D = isObject3D(object);
  } else {
    isVisible.value = false;
  }
}
bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    // 监听对象选中
    viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
      console.log("111111")
      sync();
    })
    // 监听对象变化
    viewer.editor.editorEventManager.objectChanged.subscribe((object) => {

    })
  }
})

const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  if (!isActive.value) return;

  if (name === "color") {


    // object.color.setStyle(value)
  } else {
    // set(object, name, value);
  }
})

const update = (object: THREE.Object3D, isInit: boolean = false) => {
  if (isInit) {
    const animations = object.animations;
    if (animations.length > 0) {
      // setAnimationsList(animations);
    } else {
      // setAnimationsList([]);
    }
  }
}
// 更新对象
// const onFieldsChange = (changedFields, allFields) => {
//   const changedField = changedFields[0];
//   const names = changedField.name;
//   const value = changedField.value;
//   //
//   if (selectObject3D) {
//     //
//     //
//     if (["rotation"].includes(names[0])) {
//       viewer?.editor.setValueExecute(selectObject3D, names, THREE.MathUtils.degToRad(value));
//     } else {
//       viewer?.editor.setValueExecute(selectObject3D, names, value);
//     }
//     if (["position", "rotation", "scale"].includes(names[0])) {
//       viewer?.eventManager.selectObjectChanged.next(selectObject3D);
//     }
//   }
// }

</script>

<template>
  <LightAttribute v-if="show.isLight"/>
  <object3-d-attribute v-else-if="show.isGroup || show.isMesh || show.isObject3D"/>
  <div v-else class="h-full flex justify-center items-center">
    <el-empty description="未选择对象"/>
  </div>
</template>

<style scoped>

</style>