<script lang="ts" setup xmlns="">
import {ElButton, ElCol, ElForm, ElRow} from "element-plus";
import {ref} from "vue";
import {Object3D} from "three";
import {useAttributeProvide, useBus} from "../../../hooks";
import {find} from "lodash-es";
import {BoolItem, InputItem, InputNumberItem, TextItem, Vector3Item} from "../../../common-ui";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";
import UserDataItem from "../../../common-ui/attributeItem/UserDataItem.vue";
import {useObjectChangedBind} from "../../../hooks/useObjectChangedBind.ts";

const bus = useBus();
const {toggle} = useAttributeProvide({
  isAutoUpdate: true,
  getObject: () => {
    return bus.selectObject
  }
})


const {} = useBindSubscribe({
  fun: toggle,
  isMounted: true,
  isViewerInit: false,
  isBindCallFun: false,
})

const {} = useObjectChangedBind({
  fun: toggle,
})

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
  <el-form label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <vector3-item label="位置" name="position"/>
    <vector3-item label="旋转" name="rotation" isRotation/>
    <vector3-item label="缩放" name="scale"/>
    <bool-item label="产生阴影" name="castShadow"/>
    <bool-item label="接收阴影" name="receiveShadow"/>
    <bool-item label="可见性" name="visible"/>
    <bool-item label="视锥体裁剪" name="frustumCulled"/>
    <input-number-item label="渲染次序" name="renderOrder"/>
    <user-data-item/>

    <el-row v-for="(item, index) in animationsList" :key="index">
      <el-col :span="12">{{ item.name }}</el-col>
      <el-col :span="12">
        <el-button @click="play(item.name)">播放</el-button>
      </el-col>
    </el-row>
  </el-form>

</template>

<style scoped>

</style>