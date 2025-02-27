<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElEmpty} from "element-plus";
import {useBus} from "../../../hooks";
import * as THREE from "three";

import {set} from "lodash-es";
import {isGroup, isLight, isMesh} from "three-is";
import {type AttributePaneNameProps, useAttributePane} from "../useAttributePane.ts";
import LightAttribute from "./Light/LightAttribute.vue";
import MeshAttribute from "./MeshAttribute.vue";
import GroupAttribute from "./GroupAttribute.vue";

const bus = useBus();
const props = defineProps<AttributePaneNameProps>();
const {isActive} = useAttributePane(props)


//----------------------------
interface Position {
  x: number;
  y: number;
  z: number;
}

interface Rotation {
  x: number;
  y: number;
  z: number;
}

interface Scale {
  x: number;
  y: number;
  z: number;
}

interface ObjectAttributeForm {
  type?: string
  uuid?: string
  name?: string
  position: Position;
  rotation: Rotation;
  scale: Scale;
  shadowArray?: string[];
  frustumCulled?: boolean;
  renderOrder?: number;
  visible?: boolean;
  color?: string;
  intensity?: number;
}

const form = reactive<ObjectAttributeForm>({
  type: "",
  uuid: "",
  name: '',
  position: {x: 11, y: 0, z: 0},
  rotation: {x: 0, y: 0, z: 0},
  scale: {x: 0, y: 0, z: 0},
  shadowArray: [] as string[],
  frustumCulled: false,
  renderOrder: 0,
  visible: false,

  color: undefined,
  intensity: undefined
})
//-----------------------------------
const isVisible = ref(false);

const show = reactive({
  light: false,
  mesh: false,
  group: false,
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    console.log("监听对象")

    // 监听对象选中
    viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
      console.log("更新对象", object);
      if (object && isActive.value) {
        isVisible.value = true;

        show.light = isLight(object);
        show.mesh = isMesh(object);
        show.group = isGroup(object);
        console.log("show",show)
        threeSyncUi(object);
      } else {
        isVisible.value = false;
      }
    })

    // 监听对象变化
    viewer.editor.editorEventManager.objectChanged.subscribe((object) => {
      return

      console.log("更新对象", object);
      if (object && isActive.value) {
        threeSyncUi(object);
      }
    })
  }
})

bus.objectAttributeChangeSubject.subscribe((editValue) => {
  console.log(editValue)
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  if (!isActive.value) return;

  if (name === "color") {
    console.log(value)
    console.log(object)
    object.color.setStyle(value)
  } else {
    set(object, name, value);
  }
})


const threeSyncUi = (object: THREE.Object3D) => {
  return
  form.type = "java"

  form.position.x = object.position.x;
  form.position.y = object.position.y;
  form.position.z = object.position.z;

  form.rotation.x = THREE.MathUtils.degToRad(object.rotation.x);
  form.rotation.y = THREE.MathUtils.degToRad(object.rotation.y);
  form.rotation.z = THREE.MathUtils.degToRad(object.rotation.z);

  form.scale.x = object.scale.x;
  form.scale.y = object.scale.y;
  form.scale.z = object.scale.z;

  form.shadowArray = []
  console.log(object.castShadow)
  if (object.castShadow) {
    form.shadowArray.push("castShadow")
  }
  if (object.receiveShadow) {
    form.shadowArray.push("receiveShadow")
  }

  // form.receiveShadow = object.receiveShadow
  // form.castShadow = object.castShadow
  console.log(form.shadowArray)
  form.frustumCulled = object.frustumCulled
  form.renderOrder = object.renderOrder

  form.visible = object.visible
  console.log(form)

  if (isLightType) {
    console.log(object.color.getHexString())
    form.color = `#${object.color.getHexString()}`
    form.intensity = object.intensity
  }
}

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
//   // console.log(name,value)
//   if (selectObject3D) {
//     // console.log(names)
//     // console.log(value)
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
  <LightAttribute v-if="show.light"/>
  <group-attribute v-else-if="show.group"/>
  <mesh-attribute v-else-if="show.mesh"/>
  <div v-else class="h-full flex justify-center items-center">
    <el-empty description="未选择对象"/>
  </div>


</template>

<style scoped>

</style>