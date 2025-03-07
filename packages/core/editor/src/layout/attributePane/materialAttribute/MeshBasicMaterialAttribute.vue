<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import {isArray, set} from "lodash-es";
import * as THREE from "three";
import {isBoxGeometry, isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {BoolItem, ColorItem, InputItem, InputNumberItem, SelectItem, TextItem} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";
import {blendingOptions, sideOptions} from "./selectOptions.ts";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();

const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object) && isBoxGeometry(object.geometry)) {
    threeToUi(object.geometry);
  }
}
const {} = useBindSubscribe(sync);

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {

  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  if (!isActive.value) return;
  set(object, name, value);
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  color: '',
  reflectivity: 0,

  // envMap: null,
  // lightMap: null,
  // aoMap: null,
  aoMapIntensity: 0,

  side: 0, // THREE.DoubleSide (0), THREE.FrontSide (1), THREE.BackSide (2)
  flatShading: false,
  blending: 0, // THREE.NormalBlending (0), THREE.AdditiveBlending (1), etc.
  opacity: 1,
  transparent: false,

  forceSinglePass: false,

  alphaTest: 0,
  depthTest: true,
  depthWrite: true,

  wireframe: false,
});

// ui -> three
const threeToUi = (object: THREE.Mesh) => {
  const _material = object.material;
  const material: THREE.MeshPhysicalMaterial = isArray(_material) ? _material[0] as THREE.MeshPhysicalMaterial : _material as THREE.MeshPhysicalMaterial;

  form.type = material.type;
  form.uuid = material.uuid;
  form.name = material.name;
  form.color = `#${material.color.getHexString()}`;
  form.reflectivity = material.reflectivity;

  // form.map = material.map;
  // form.emissiveMap = material.emissiveMap;
  // form.alphaMap = material.alphaMap;

  // form.envMap= material.envMap;
  // form.lightMap= material.lightMap;
  // form.aoMap= material.aoMap;
  form.aoMapIntensity = material.aoMapIntensity;

  form.side = material.side;
  form.flatShading = material.flatShading;
  form.blending = material.blending;
  form.opacity = material.opacity;
  form.transparent = material.transparent;

  form.forceSinglePass = material.forceSinglePass;

  form.alphaTest = material.alphaTest;
  form.depthTest = material.depthTest;
  form.depthWrite = material.depthWrite;

  form.wireframe = material.wireframe;


}
</script>

<template>
  <el-form :model="form" label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <color-item label="颜色" name="color"/>
    <input-number-item label="反射率" name="reflectivity"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="高光贴图" name="specularMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="环境贴图" name="envMap"/>
    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item label="环境光遮蔽贴图强度" name="aoMapIntensity"/>

    <select-item :options="sideOptions" label="面" name="side"/>
    <bool-item label="平面着色" name="flatShading"/>

    <select-item :options="blendingOptions" label="混合" name="blending"/>
    <input-number-item label="透明度" name="opacity"/>
    <bool-item label="透明性" name="transparent"/>

    <bool-item label="强制单通道" name="forceSinglePass"/>
    <bool-item label="α测试" name="alphaTest"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓写" name="depthWrite"/>
    <bool-item label="线宽" name="wireframe"/>
  </el-form>

</template>

<style scoped>

</style>