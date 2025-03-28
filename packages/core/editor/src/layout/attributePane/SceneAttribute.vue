<script lang="ts" setup>
import {ColorItem, InputNumberItem, SelectItem, Vector3Item} from "../../common-ui";
import {ElForm} from "element-plus";
import {useAttributeProvide, useBus} from "../../hooks";
import {reactive, watch} from "vue";
import {isColor, isFog, isFogExp2, isMeshBasicMaterial, isMeshNormalMaterial, isTexture} from "three-is";

import {
  Color,
  EquirectangularReflectionMapping,
  MathUtils,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Texture,
  UVMapping
} from "three";
import {Viewer} from "@plum-render/three-sdk";
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
  if (!scene) return;
  if (name === "overrideMaterial") {
    switch (value) {
      case "无":
        scene.overrideMaterial = null;
        break
      case "法线":
        scene.overrideMaterial = new MeshNormalMaterial();
        break
      case "描边":
        scene.overrideMaterial = new MeshBasicMaterial({
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
        scene.background = new Color(form.backgroundColor);
        break
      case "贴图":
        if (isTexture(scene.background)) {
          scene.background.mapping = UVMapping;
        } else {
          scene.background = new Texture();
        }
        break;
      case "全景":
        if (isTexture(scene.background)) {
          scene.background.mapping = EquirectangularReflectionMapping;
        } else {
          scene.background = new Texture();
        }
        break;
    }
  } else if (name === "backgroundColor") {
    (scene.background as Color).setStyle(value);
  } else if (name === "backgroundTexture") {
    if (value === "") {
      scene.background = null;
    } else {
      scene.background = value as Texture;
      if (form.backgroundType === "全景") {
        scene.background.mapping = EquirectangularReflectionMapping;
      }
    }
  } else if (name === "environmentImage") {
    if (value === "") {
      scene.environment = null;
    } else {
      scene.environment = value as Texture;
      scene.environment.mapping = EquirectangularReflectionMapping;
    }
  } else if (name === "fogType") {
    switch (value) {
      case "无":
        scene.fog = null;
        break;
      case "雾":
        scene.fog = new Fog(form.fogColor, form.near, form.far);
        break;
      case "指数雾":
        scene.fog = new FogExp2(form.fogColor, form.density);
        break;
    }
  } else if (name === "environmentType") {
    if (value === "无") {
      scene.environment = null
    } else if (value === "同步背景" && isTexture(scene.background)) {
      scene.environment = scene.background;
      scene.environment.mapping = EquirectangularReflectionMapping;
      scene.environmentRotation.x = scene.backgroundRotation.x;
      scene.environmentRotation.y = scene.backgroundRotation.y;
      scene.environmentRotation.z = scene.backgroundRotation.z;
    } else if (value === "贴图") {
      scene.environment = new Texture();
    }
  } else if (isArray(name)) {
    if (name[0] === "backgroundRotation") {
      set(scene, ['backgroundRotation', name[1]], MathUtils.degToRad(value));
    } else if (name[0] === "environmentRotation") {
      set(scene, ['environmentRotation', name[1]], MathUtils.degToRad(value));
    }
  } else if (["fogColor", "far", "density"].includes(name)) {
    const fog = scene.fog;
    if (!fog) return;
    if (name === "fogColor") {
      fog.color.setStyle(value);
    } else {
      set(fog, name, value);
    }
  } else {
    set(scene, name, value);
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
  environmentImage: "",
  environmentIntensity: 0,
  environmentType: "无",
  fogType: "雾",
  fogColor: "#ffffff",
  density: 0.00025,
  near: 1,
  far: 1000,
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();
})


const sync = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
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
    if (background.mapping === EquirectangularReflectionMapping) {
      form.backgroundType = "全景";
    } else {
      form.backgroundType = "贴图";
    }
  } else {
    form.backgroundType = "无";
  }
  form.backgroundRotation.x = MathUtils.radToDeg(scene.backgroundRotation.x);
  form.backgroundRotation.y = MathUtils.radToDeg(scene.backgroundRotation.y);
  form.backgroundRotation.z = MathUtils.radToDeg(scene.backgroundRotation.z);
  form.backgroundBlurriness = scene.backgroundBlurriness;
  form.backgroundIntensity = scene.backgroundIntensity;
}
const updateEnvironmentType = (viewer: Viewer) => {
  const scene = viewer.scene;
  const environment = viewer.scene.environment;
  if (isTexture(environment)) {
    if (environment === scene.background) {
      form.environmentType = "同步背景";
    } else if (environment.mapping === EquirectangularReflectionMapping) {
      form.environmentType = "全景";
    } else {
      form.environmentType = "贴图";
    }
  } else {
    form.environmentType = "无";
  }
  form.environmentRotation.x = MathUtils.radToDeg(scene.environmentRotation.x);
  form.environmentRotation.y = MathUtils.radToDeg(scene.environmentRotation.y);
  form.environmentRotation.z = MathUtils.radToDeg(scene.environmentRotation.z);
  form.environmentIntensity = scene.environmentIntensity;
}
const updateFogType = (viewer: Viewer) => {
  const scene = viewer.scene;
  const fog = scene.fog;

  if (isFogExp2(fog)) {
    form.fogType = "指数雾"
    form.fogColor = `#${fog.color.getHexString()}`
    form.density = fog.density
  } else if (isFog(fog)) {
    form.fogType = "雾"
    form.fogColor = `#${fog.color.getHexString()}`
    form.near = fog.near
    form.far = fog.far
  } else {
    form.fogType = "无"
  }
  // console.log("form", form)
}

const getTexture = () => {
  return bus.viewer?.scene.background as Texture | null;
}

</script>

<template>
  <el-form :label-width="80" label-position="left" size="small">
    <select-item v-model="form.overrideMaterial" :options="overrideMaterialList" label="覆盖材质"
                 name="overrideMaterial"/>
    <select-item v-model="form.backgroundType" :options="backgroundTypeList" label="背景类型" name="backgroundType"/>
    <color-item v-if="form.backgroundType === '颜色'" v-model="form.backgroundColor" label="背景颜色"
                name="backgroundColor"/>
    <texture-item v-if="form.backgroundType==='贴图' || form.backgroundType==='全景'" v-model="form.backgroundTexture"
                  :get-texture="getTexture"
                  label="背景图片" name="backgroundTexture"
                  :checkbox="false"
    />

    <input-number-item v-if="form.backgroundType ==='全景'" v-model="form.backgroundBlurriness"
                       :formProps="{max:1,min:0,step:0.01,precision:2  }" label="背景贴图" name="backgroundBlurriness"/>
    <input-number-item v-if="form.backgroundType === '全景'" v-model="form.backgroundIntensity"
                       :formProps="{max:1,min:0,step:0.01,precision:2  }" label="背景强度" name="backgroundIntensity"/>
    <vector3-item v-if="form.backgroundType === '全景'" v-model="form.backgroundRotation"
                  :formProps="{step:1,precision:2 }"
                  label="背景旋转" name="backgroundRotation"/>

    <select-item v-model="form.environmentType" :options="envTypeList" label="环境类型" name="environmentType"/>
    <texture-item v-if="form.environmentType==='贴图'" v-model="form.environmentImage"
                  :get-texture="getTexture"
                  label="船舰贴图" name="environmentImage"
                  :checkbox="false"
    />
    <input-number-item v-if="form.environmentType !== '无'" v-model="form.environmentIntensity"
                       :formProps="{max:1,min:0,step:0.01,precision:2  }" label="环境强度" name="environmentIntensity"/>
    <vector3-item v-if="form.environmentType !== '无'" v-model="form.environmentRotation" :formProps="{step:1,precision:2 }"
                  label="环境旋转" name="environmentRotation"/>

    <select-item v-model="form.fogType" :options="fogList" label="雾" name="fogType"/>

    <color-item v-if="form.fogType !== '无'" v-model="form.fogColor" label="雾颜色" name="fogColor"/>
    <input-number-item v-if="form.fogType === '指数雾'" v-model="form.density" :formProps="{min:0,step:0.01,precision:5}"
                       label="雾密度" name="density"/>
    <input-number-item v-if="form.fogType === '雾'" v-model="form.near" :formProps="{min:0,step:1 }" label="最小距离"
                       name="near"/>
    <input-number-item v-if="form.fogType === '雾'" v-model="form.far" :formProps="{min:0,step:1  }" label="最大距离"
                       name="far"/>
  </el-form>
</template>

<style scoped>

</style>