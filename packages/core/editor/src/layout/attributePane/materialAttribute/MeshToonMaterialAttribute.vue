<script lang="ts" setup>
import {ElForm} from "element-plus";
import {reactive} from "vue";
import {isArray, set} from "lodash-es";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {BoolItem, ColorItem, InputNumberItem, SelectItem, TextItem, Vector2Item} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";
import {blendingOptions, sideOptions} from "./selectOptions.ts";
import {useBindSubscribe} from "../../../hooks/useBindSubscribe.ts";

const bus = useBus();
const sync = () => {
  const object = bus.selectObject;
  if (object && isMesh(object)) {
    threeToUi(object);
  }
}
 const {} = useBindSubscribe({
  fun: sync,
  isMounted: true,
  isBindCallFun: true,
})

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide(false)
objectAttributeChangeSubject.subscribe((editValue) => {

  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;
  set(object, name, value);
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  color: '',
  emissive: "",

  vertexColors: false,

  // map: null,
  // emissiveMap: null,
  // alphaMap: null,

  // bumpMap: null,
  bumpScale: 0,

  // normalMap: null,
  normalScale: {
    x: 1,
    y: 1,
  },

  // displacementMap: null,
  displacementScale: 0,


  // lightMap: null,
  // aoMap: null,
  aoMapIntensity: 0,

  // gradientMap: null,

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
  form.emissive = `#${material.emissive.getHexString()}`;

  form.vertexColors = material.vertexColors;

  // form.map = material.map;
  // form.emissiveMap = material.emissiveMap;
  // form.alphaMap = material.alphaMap;

  // form.bumpMap = material.bumpMap;
  form.bumpScale = material.bumpScale;

  // form.normalMap= material.normalMap;
  form.normalScale.x = material.normalScale.x;
  form.normalScale.y = material.normalScale.y;

  // form.displacementMap = material.displacementMap;
  form.displacementScale = material.displacementScale;

  // form.lightMap= material.lightMap;
  // form.aoMap= material.aoMap;
  form.aoMapIntensity = material.aoMapIntensity;

  // form.gradientMap= material.gradientMap;


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
  <el-form  label-position="left" label-width="80" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>
    <color-item label="颜色" name="color"/>
    <color-item label="自发光" name="emissive"/>
    <bool-item label="顶点颜色" name="vertexColors"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="自发光贴图" name="emissiveMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="凹凸贴图" name="bumpMap"/>
    <input-number-item label="凹凸缩放" name="bumpScale"/>

    <texture-item label="法线贴图" name="bumpMap"/>
    <vector2-item label="法线缩放" name="normalScale"/>

    <texture-item label="置换贴图" name="displacementMap"/>
    <input-number-item label="置换缩放" name="displacementScale"/>

    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item label="环境光遮蔽贴图强度" name="aoMapIntensity"/>

    <texture-item label="渐变贴图" name="gradientMap"/>

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