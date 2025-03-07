<script lang="ts" setup xmlns="">
import {ElButton, ElCheckbox, ElCheckboxGroup, ElCol, ElForm, ElFormItem, ElRow} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import * as THREE from "three";
import {Object3D} from "three";
import {useAttributeProvide, useBus} from "../../../hooks";
import {isMesh, isObject3D} from "three-is";
import {find, set} from "lodash-es";
import {BoolItem, InputItem, InputNumberItem, TextItem, Vector3Item} from "../../../common-ui";

const bus = useBus();
const form = reactive({
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
})

const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  if (!isMesh(object)) return;
  set(object, name, value);
})
onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  viewer.editor.editorEventManager.objectSelected.subscribe(() => {
    threeToUi()
  })
  threeToUi()
})

const threeToUi = () => {
  const object = bus.selectObject;
  if (!isObject3D(object)) return

  form.type = "组"
  form.uuid = object.uuid
  form.name = object.name

  form.position.x = object.position.x;
  form.position.y = object.position.y;
  form.position.z = object.position.z;

  form.position.x = object.position.x;
  form.position.y = object.position.y;
  form.position.z = object.position.z;

  form.rotation.x = THREE.MathUtils.degToRad(object.rotation.x);
  form.rotation.y = THREE.MathUtils.degToRad(object.rotation.y);
  form.rotation.z = THREE.MathUtils.degToRad(object.rotation.z);

  form.scale.x = object.scale.x;
  form.scale.y = object.scale.y;
  form.scale.z = object.scale.z;

  form.visible = object.visible
  form.frustumCulled = object.frustumCulled
  form.renderOrder = object.renderOrder;

  animationsList.value = animationsToList(object)
}
const animationsList = ref<{ name: string }[]>([])
const animationsToList = (object: Object3D) => {
  const animations = object.animations;
  const list = []
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    list.push({
      name: animation.name,
    })
  }
  return list
}

const play = (item: string) => {
  const viewer = bus.viewer;
  const selectObject3D = bus.selectObject;
  if (viewer && selectObject3D) {
    const animation = find(selectObject3D.animations, {name: item})!;
    const action = viewer.animationMixer.clipAction(animation, selectObject3D);
    action.isRunning() ? action.stop() : action.play();
  }
}
</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <vector3-item label="位置" name="position"/>
    <vector3-item label="旋转" name="rotation"/>
    <vector3-item label="缩放" name="scale"/>
    <el-form-item label="阴影">
      <el-checkbox-group v-model="form.shadowArray">
        <el-checkbox name="type" value="castShadow">
          产生
        </el-checkbox>
        <el-checkbox name="type" value="receiveShadow">
          接收
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <bool-item label="可见性" name="visible"/>
    <bool-item label="视锥体裁剪" name="frustumCulled"/>
    <input-number-item label="渲染次序" name="renderOrder"/>

    <el-row v-for="(item, index) in animationsList" :key="index">
      <el-col :span="12">{{ item.name }}</el-col>
      <el-col :span="12">
        <el-button @click="play(item.name)">播放</el-button>
      </el-col>
    </el-row>
    <!--        <JsonItem label="自定义数据" name="userData"/>-->
  </el-form>

</template>

<style scoped>

</style>