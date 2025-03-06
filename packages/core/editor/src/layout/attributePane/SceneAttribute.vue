<script lang="ts" setup>
import {ColorItem, InputNumberItem, SelectItem, Vector3Item} from "../../common-ui";
import {ElForm} from "element-plus";
import {useAttributeProvide, useBus} from "../../hooks";
import {reactive, watch} from "vue";
import {isColor, isFog, isFogExp2, isMeshBasicMaterial, isMeshNormalMaterial, isTexture} from "three-is";
import * as THREE from "three";
import {TextureAsset, Viewer} from "@plum-render/three-sdk";
import {useActiveTab} from "../../hooks/useActiveTab.ts";
import {isArray, set} from "lodash-es";
import TextureItem from "../../common-ui/attributeItem/TextureItem.vue";

const overrideMaterialList = [
  {value: "无", label: '无'},
  {value: "法线", label: '法线'},
  {value: "描边", label: '描边'},
]
const backgroundTypeList = [
  {value: "无", label: '无'},
  {value: "颜色", label: '颜色'},
  {value: "贴图", label: '贴图'},
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
const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const scene = bus.scene;
  const viewer = bus.viewer;
  if (!scene) return;
  if (name === "overrideMaterial") {
    switch (value) {
      case "无":
        scene.overrideMaterial = null;
        break
      case "法线":
        scene.overrideMaterial = new THREE.MeshNormalMaterial();
        break
      case "描边":
        scene.overrideMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
          wireframe: true
        });
        break;
    }
  } else if (name === "backgroundType") {
    switch (value) {
      case "无":
        scene.background = null;
        break
      case "颜色":
        scene.background = new THREE.Color(form.backgroundColor);
        break
      case "贴图":
        scene.background = new THREE.Texture();
        break;
    }
  } else if (name === "backgroundColor") {
    (scene.background as THREE.Color).setStyle(value);
  } else if (name === "backgroundImage") {
    if (value === "") {
      scene.background = null;
    } else {
      scene.background = new THREE.TextureLoader().load(value);
    }
  } else if (name === "environmentImage") {
    if (value === "") {
      scene.environment = null;
    } else {
      if (value.length > 0) {
        if (value.length === 1) {
          let textureAsset = new TextureAsset({
            file: value[0]
          })
          viewer!.assetManager.loadTexture(textureAsset).then((texture) => {
            scene.environment = texture;
            scene.environment.mapping = THREE.EquirectangularReflectionMapping;
          })
        } else if (value.length === 6) {
          scene.environment = new THREE.CubeTextureLoader().load(value);
        }
      }
    }
  } else if (name === "fogType") {
    switch (value) {
      case "无":
        scene.fog = null;
        break;
      case "雾":
        debugger
        scene.fog = new THREE.Fog(form.fogColor, form.fogNear, form.fogFar);
        break;
      case "指数雾":
        scene.fog = new THREE.FogExp2(form.fogColor, form.fogDensity);
        break;
    }
  } else if (name === "environmentType") {
    if (value === "背景" && scene.background !== null && isTexture(scene.background)) {
      scene.environment = scene.background;
      scene.environment.mapping = THREE.EquirectangularReflectionMapping;
      scene.environmentRotation.y = scene.backgroundRotation.y;
    }
  } else if (isArray(name)) {
    if (name[0] === "backgroundRotation") {
      scene.backgroundRotation.x = THREE.MathUtils.degToRad(value[0]);
      scene.backgroundRotation.y = THREE.MathUtils.degToRad(value[1]);
      scene.backgroundRotation.z = THREE.MathUtils.degToRad(value[2]);
    } else if (name[0] === "environmentRotation") {
      scene.environmentRotation.x = THREE.MathUtils.degToRad(value[0]);
      scene.environmentRotation.y = THREE.MathUtils.degToRad(value[1]);
      scene.environmentRotation.z = THREE.MathUtils.degToRad(value[2]);
    }
  } else if (["fogColor", "fogFar", "fogDensity"].includes(name)) {
    const fog = scene.fog;
    if (!fog) return;
    if (name === "fogColor") {
      fog.color.setStyle(value);
    } else {
      set(fog, name, value);
    }
  }
})

const {isActive} = useActiveTab("场景")

watch(isActive, (value) => {
  if (value) {
    sync();
  }
})

const form = reactive({
  overrideMaterial: '无',
  backgroundType: "无",
  backgroundRotation: {
    x: 0,
    y: 0,
    z: 0
  },
  backgroundTexture: '',
  backgroundColor: "#ffffff",
  backgroundBlurriness: 0,
  backgroundIntensity: 0,
  environmentRotation: {
    x: 0,
    y: 0,
    z: 0
  },
  environmentIntensity: 0,
  environmentType: "无",
  fogType: "雾",
  fogColor: "#ffffff",
  fogDensity: 0.00025,
  fogNear: 1,
  fogFar: 1000,
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();
})


const sync = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
  console.log("form", form)
  updateOverrideMaterial(viewer);
  updateBackgroundType(viewer);
  updateEnvironmentType(viewer);
  updateFogType(viewer);
}

const updateOverrideMaterial = (viewer: Viewer) => {
  const material = viewer.scene.overrideMaterial;
  if (isMeshNormalMaterial(material)) {
    form.overrideMaterial = "法线";
  } else if (isMeshBasicMaterial(material)) {
    form.overrideMaterial = "描边";
  } else {
    form.overrideMaterial = "无";
  }
}
const updateBackgroundType = (viewer: Viewer) => {
  const scene = viewer.scene;
  const background = viewer.scene.background;
  if (isColor(background)) {
    form.backgroundType = "颜色";
  } else if (isTexture(background)) {
    form.backgroundType = "贴图";
  } else {
    form.backgroundType = "无";
  }
  form.backgroundRotation.x = THREE.MathUtils.radToDeg(scene.backgroundRotation.x);
  form.backgroundRotation.y = THREE.MathUtils.radToDeg(scene.backgroundRotation.y);
  form.backgroundRotation.z = THREE.MathUtils.radToDeg(scene.backgroundRotation.z);
  form.backgroundBlurriness = scene.backgroundBlurriness;
  form.backgroundIntensity = scene.backgroundIntensity;
}
const updateEnvironmentType = (viewer: Viewer) => {
  const scene = viewer.scene;
  const environment = viewer.scene.environment;
  if (isTexture(environment)) {
    form.environmentType = "贴图";
  } else {
    form.environmentType = "无";
  }
  form.environmentRotation.x = THREE.MathUtils.radToDeg(scene.environmentRotation.x);
  form.environmentRotation.y = THREE.MathUtils.radToDeg(scene.environmentRotation.y);
  form.environmentRotation.z = THREE.MathUtils.radToDeg(scene.environmentRotation.z);
  form.environmentIntensity = scene.environmentIntensity;
}
const updateFogType = (viewer: Viewer) => {
  const scene = viewer.scene;
  const fog = scene.fog;

  if (isFogExp2(fog)) {
    form.fogType = "指数雾"
    form.fogColor = `#${fog.color.getHexString()}`
    form.fogDensity = fog.density
  } else if (isFog(fog)) {
    form.fogType = "雾"
    form.fogColor = `#${fog.color.getHexString()}`
    form.fogNear = fog.near
    form.fogFar = fog.far
  } else {
    form.fogType = "无"
  }
}

const getTexture = () => {
  return bus.viewer?.scene.background as THREE.Texture | undefined;
}

</script>

<template>
  <el-form :label-width="80" :model="form" label-position="left" size="small">
    <select-item :options="overrideMaterialList" label="覆盖材质" name="overrideMaterial"/>
    <select-item :options="backgroundTypeList" label="背景类型" name="backgroundType"/>
    <color-item v-if="form.backgroundType === '颜色'" label="背景颜色" name="backgroundColor"/>
    <texture-item v-if="form.backgroundType==='贴图'" label="背景图片" name="backgroundTexture"
                  :get-texture="getTexture"/>

    <input-number-item v-if="form.backgroundType ==='贴图'" :formProps="{max:1,min:0,step:0.01,precision:2  }"
                       label="背景模糊" name="backgroundBlurriness"/>
    <input-number-item v-if="form.backgroundType === '贴图'" :formProps="{max:1,min:0,step:0.01,precision:2  }"
                       label="背景强度" name="backgroundIntensity"/>
    <vector3-item v-if="form.backgroundType === '贴图'" :formProps="{max:1,min:0,step:0.01,precision:2 }" label="背景旋转"
                  name="backgroundRotation"/>

    <select-item :options="envTypeList" label="环境类型" name="environmentType"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2  }" label="环境强度" name="environmentIntensity"/>
    <vector3-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="环境旋转" name="environmentRotation"/>

    <select-item :options="fogList" label="雾" name="fogType"/>

    <color-item v-if="form.fogType !== '无'" label="雾颜色" name="fogColor"/>
    <input-number-item v-if="form.fogType === '指数雾'" :formProps="{min:0,step:0.01,precision:5  }" label="雾密度"
                       name="fogDensity"/>
    <input-number-item v-if="form.fogType === '雾'" :formProps="{min:0,step:1 }" label="最小距离" name="fogNear"/>
    <input-number-item v-if="form.fogType === '雾'" :formProps="{min:0,step:1  }" label="最大距离" name="fogFar"/>
  </el-form>
</template>

<style scoped>

</style>