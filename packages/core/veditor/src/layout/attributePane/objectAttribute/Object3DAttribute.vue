<script setup lang="ts">
import {ElCheckbox, ElCheckboxGroup, ElForm, ElFormItem} from "element-plus";
import {onMounted, reactive} from "vue";
import * as THREE from "three";
import {useBus} from "../../../hooks";
import {BoolItem, InputItem, InputNumberItem, TextItem, Vector3Item} from "../../../common-ui";
import {isGroup, isLight, isMesh, isObject3D} from "three-is";

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

const bus = useBus();
onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  viewer.editor.editorEventManager.objectSelected.subscribe(() => {
    threeToUi()
  })
  threeToUi()
})
bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    viewer.editor.editorEventManager.objectSelected.subscribe(() => {
      threeToUi()
    })
    threeToUi()
  }
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
  form.renderOrder = object.renderOrder
}

</script>

<template>

  <el-form :model="form" label-width="auto" size="small">
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
    <!--        <JsonItem label="自定义数据" name="userData"/>-->
  </el-form>

</template>

<style scoped>

</style>