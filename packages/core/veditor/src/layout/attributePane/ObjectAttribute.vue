<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {ElCheckbox, ElCheckboxGroup, ElEmpty, ElForm, ElFormItem} from "element-plus";
import {useBus} from "../../hooks";
import * as THREE from "three";

import {set} from "lodash-es";
import {isLight} from "three-is";
import {type AttributePaneNameProps, useAttributePane} from "./useAttributePane.ts";
import AmbientLightAttribute from "./Light/AmbientLightAttribute.vue";
import DirectionalLightAttribute from "./Light/DirectionalLightAttribute.vue";
import HemisphereLightAttribute from "./Light/HemisphereLightAttribute.vue";
import PointLightAttribute from "./Light/PointLightAttribute.vue";
import SpotLightAttribute from "./Light/SpotLightAttribute.vue";
import LightAttribute from "./Light/LightAttribute.vue";
import {BoolItem, ColorItem, InputItem, InputNumberItem, TextItem, Vector3Item} from "../../common-ui";

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
  light: false
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
  <div v-else class="h-full flex justify-center items-center">
    <el-empty description="未选择对象"/>
  </div>

<!--  <el-form :model="form" label-width="auto" size="small">-->
<!--    <text-item label="类型" name="type"/>-->
<!--    <text-item label="uuid" name="uuid"/>-->
<!--    <input-item label="名称" name="name"/>-->
<!--    <vector3-item label="位置" name="position"/>-->
<!--    <vector3-item label="旋转" name="rotation"/>-->
<!--    <vector3-item label="缩放" name="scale"/>-->
<!--    <el-form-item label="阴影">-->
<!--      <el-checkbox-group v-model="form.shadowArray">-->
<!--        <el-checkbox name="type" value="castShadow">-->
<!--          产生-->
<!--        </el-checkbox>-->
<!--        <el-checkbox name="type" value="receiveShadow">-->
<!--          接收-->
<!--        </el-checkbox>-->
<!--      </el-checkbox-group>-->
<!--    </el-form-item>-->
<!--    <bool-item label="可见性" name="visible"/>-->
<!--    <bool-item label="视锥体裁剪" name="frustumCulled"/>-->
<!--    <input-number-item label="渲染次序" name="renderOrder"/>-->
<!--    <input-number-item label="强度" name="intensity"/>-->
<!--    <color-item label="颜色" name="color"/>-->
<!--    <input-number-item label="阴影强度" name="shadow.intensity"/>-->
<!--    <input-number-item label="阴影偏移" name="shadow.bias"/>-->
<!--    <input-number-item label="阴影法线偏移" name="shadow.normalBias"/>-->
<!--    <input-number-item label="阴影半径" name="shadow.radius"/>-->
<!--    <color-item label="基色" name="groundcolor"/>-->
<!--    <input-number-item label="距离" name="distance"/>-->
<!--    <input-number-item label="角度" name="angle"/>-->
<!--    <input-number-item label="边缘" name="penumbra"/>-->
<!--    <input-number-item label="衰减" name="decay"/>-->
<!--    <BoolItem label="接收阴影" name="receiveShadow"/>-->
<!--    <BoolItem label="产生阴影" name="castShadow"/>-->
<!--    &lt;!&ndash;        <JsonItem label="自定义数据" name="userData"/>&ndash;&gt;-->
<!--  </el-form>-->

</template>

<style scoped>

</style>