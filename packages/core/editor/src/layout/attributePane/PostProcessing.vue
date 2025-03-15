<script lang="ts" setup>
import {BoolItem} from "../../common-ui";
import {ElForm} from "element-plus";
import {useAttributeProvide, useBus} from "../../hooks";
import {reactive, watch} from "vue";
import {Viewer} from "@plum-render/three-sdk";
import {useActiveTab} from "../../hooks/useActiveTab.ts";

const overrideMaterialList = [
  {value: "无", label: '无'},
  {value: "法线", label: '法线'},
  {value: "描边", label: '描边'},
]
const backgroundTypeList = [
  {value: "无", label: '无'},
  {value: "颜色", label: '颜色'},
  {value: "贴图", label: '贴图'},
  {value: "全景", label: '全景'},
]

const envTypeList = [
  {value: "无", label: '无'},
  {value: "贴图", label: '贴图'},
  {value: "同步背景", label: '同步背景'},
]

const fogList = [
  {value: "无", label: '无'},
  {value: "雾", label: '雾'},
  {value: "指数雾", label: '指数雾'},
]
const bus = useBus();

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide({
  isAutoUpdate: false,
  getObject: () => {
    return bus.scene
  }
})

objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const scene = bus.scene;
  const viewer = bus.viewer;
  if (!viewer) return;
  if (name === "enable") {
    viewer.postProcessingComponent.enable = value;
  }
  if (name === "outlineEnable") {
    if (value) {
      viewer.postProcessingComponent.initOutlineEffect();
    } else {
      viewer.postProcessingComponent.disposeOutlineEffect();
    }
  }
  if (name === "blurEnable") {
    if (value) {
      viewer.postProcessingComponent.initBlurEffect();
    } else {
      viewer.postProcessingComponent.disposeBlurEffect();
    }
  }
})

const {isActive} = useActiveTab("后期")

watch(isActive, (value) => {
  if (value) {
    sync();
  }
})

const form = reactive({
  enable: false,
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();
})


const sync = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
  updateForm(viewer)
}

const updateForm = (viewer: Viewer) => {
  form.enable = viewer.postProcessingComponent.enable;
}


</script>
<template>
  <el-form :label-width="80" label-position="left" size="small">
    <bool-item label="启用" name="enable"/>
    <bool-item label="描边启用" name="outlineEnable"/>
    <bool-item label="模糊启用" name="blurEnable"/>
    <!--    <select-item :options="overrideMaterialList" label="覆盖材质" name="overrideMaterial"-->
    <!--                 v-model="form.overrideMaterial"/>-->
    <!--    <color-item v-if="form.backgroundType === '颜色'" label="背景颜色" name="backgroundColor"-->
    <!--                v-model="form.backgroundColor"/>-->
    <!--    <texture-item v-if="form.backgroundType==='贴图' || form.backgroundType==='全景'" :get-texture="getTexture"-->
    <!--                  label="背景图片"-->
    <!--                  name="backgroundTexture" v-model="form.backgroundTexture"/>-->

    <!--    <input-number-item v-if="form.backgroundType ==='全景'" :formProps="{max:1,min:0,step:0.01,precision:2  }"-->
    <!--                       label="背景贴图" name="backgroundBlurriness" v-model="form.backgroundBlurriness"/>-->
  </el-form>
</template>

<style scoped>

</style>