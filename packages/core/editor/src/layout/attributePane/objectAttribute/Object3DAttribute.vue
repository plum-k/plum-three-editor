<script lang="ts" setup xmlns="">
import {ElButton, ElCol, ElForm, ElFormItem, ElRow} from "element-plus";
import {ref} from "vue";
import {useAttributeProvide, useBus} from "../../../hooks";
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
  fun: () => {
    toggle();
    animationsToList();
  },
  isMounted: true,
  isViewerInit: true,
  isBindCallFun: true,
})

const {} = useObjectChangedBind({
  fun: toggle,
})

const animationsList = ref<{ name: string, isRunning: boolean }[]>([])
const animationsToList = () => {
  if (!bus.selectObject) return;
  const animations = bus.selectObject.animations;
  const viewer = bus.viewer;
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    const action = viewer?.getAction(bus.selectObject, animation);
    if (action) {
      animationsList.value.push({
        name: animation.name,
        isRunning: action.isRunning()
      })
    }
  }
}

const play = (index: number) => {
  const viewer = bus.viewer;
  const selectObject3D = bus.selectObject;
  if (viewer && selectObject3D) {
    const animation = selectObject3D.animations[index]!
    const action = viewer.getAction(bus.selectObject, animation);
    if (action.isRunning()) {
      action.stop();
      animationsList.value[index].isRunning = false;
    } else {
      action.play();
      animationsList.value[index].isRunning = true;
    }
  }
}
</script>

<template>
  <el-form label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <vector3-item label="位置" name="position"/>
    <vector3-item isRotation label="旋转" name="rotation"/>
    <vector3-item label="缩放" name="scale"/>
    <bool-item label="产生阴影" name="castShadow"/>
    <bool-item label="接收阴影" name="receiveShadow"/>
    <bool-item label="可见性" name="visible"/>
    <bool-item label="视锥体裁剪" name="frustumCulled"/>
    <input-number-item label="渲染次序" name="renderOrder"/>
    <user-data-item/>

    <el-form-item v-if="animationsList.length > 0" label="动画" size="small">
    </el-form-item>
    <el-row v-for="(item, index) in animationsList" :key="index" class="mt-1">
      <el-col :span="12">{{ item.name }}</el-col>
      <el-col :span="12">
        <el-button @click="play(index)">{{ item.isRunning ? "停止" : "运行" }}</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped>

</style>