<script lang="ts" setup>
import {ElForm} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import {get, invoke, isArray, set} from "lodash-es";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useAttributeProvide, useBus} from "../../../hooks";
import {BoolItem, ColorItem, InputItem, InputNumberItem, SelectItem, TextItem, Vector2Item} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";
import {blendingOptions, sideOptions} from "./selectOptions.ts";
import {useActiveTab} from "../../../hooks/useActiveTab.ts";

const bus = useBus();

const {isActive} = useActiveTab("材质")

const isVisible = ref(false);

onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();

  viewer.editor.editorEventManager.objectSelected.subscribe(() => {
    sync();
  })
})

const sync = () => {
  const object = bus.selectObject;

  if (object && isMesh(object) && isActive.value) {
    isVisible.value = true;
    threeToUi(object);
  } else {
    isVisible.value = false;
  }
}

// ui -> three
const {objectAttributeChangeSubject} = useAttributeProvide()
objectAttributeChangeSubject.subscribe((editValue) => {
  const {name, value} = editValue;
  const object = bus.selectObject;
  const selectMaterial = bus.selectMaterial;
  if (!object) return;
  if (!isActive.value) return;
  if (selectMaterial && !isArray(name)) {
    if (["color", "emissive"].includes(name)) {
      invoke(get(selectMaterial, name), "setStyle", [value])
    } else {
      set(selectMaterial, name, value);
    }
  }
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  color: '',

  emissive: '',
  emissiveIntensity: 0,

  reflectivity: 0,
  ior: 0,

  roughness: 0,
  metalness: 0,

  clearcoat: 0,
  clearcoatRoughness: 0,
  dispersion: 0,

  iridescence: 0,
  iridescenceIOR: 0,

  sheen: 0,
  sheenRoughness: 0,
  sheenColor: '',

  transmission: 0,
  attenuationDistance: 0,
  attenuationColor: '',

  thickness: 0,
  vertexColors: false,

  // map: null,
  // emissiveMap: null,
  // alphaMap: null,

  // bumpMap: null,
  bumpScale: 0,

  // clearcoatMap: null,
  // clearcoatNormalMap: null,
  clearcoatNormalScale: {
    x: 1,
    y: 1,
  },
  // clearcoatRoughnessMap: null,

  // displacementMap: null,
  displacementScale: 0,

  // normalMap: null,
  normalScale: {
    x: 1,
    y: 1,
  },

  // roughnessMap: null,
  // metalnessMap: null,

  // iridescenceMap: null,
  // sheenColorMap: null,
  // sheenRoughnessMap: null,

  // iridescenceThicknessMap: null,
  iridescenceThicknessRange: [0, 0],

  // envMap: null,
  // lightMap: null,
  // aoMap: null,
  aoMapIntensity: 0,

  // transmissionMap: null,
  // thicknessMap: null,

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
  form.emissiveIntensity = material.emissiveIntensity;
  console.log("form", form)
  form.reflectivity = material.reflectivity;
  form.ior = material.ior;

  form.roughness = material.roughness;
  form.metalness = material.metalness;

  form.clearcoat = material.clearcoat;
  form.clearcoatRoughness = material.clearcoatRoughness;
  form.dispersion = material.dispersion;

  form.iridescence = material.iridescence;
  form.iridescenceIOR = material.iridescenceIOR;
  form.iridescenceThicknessRange = material.iridescenceThicknessRange;

  form.sheen = material.sheen;
  form.sheenRoughness = material.sheenRoughness;
  form.sheenColor = `#${material.sheenColor.getHexString()}`;

  form.transmission = material.transmission;
  form.attenuationDistance = material.attenuationDistance;
  form.attenuationColor = `#${material.attenuationColor.getHexString()}`

  form.thickness = material.thickness;
  form.vertexColors = material.vertexColors;

  // form.map = material.map;
  // form.emissiveMap = material.emissiveMap;
  // form.alphaMap = material.alphaMap;

  // form.bumpMap = material.bumpMap;
  form.bumpScale = material.bumpScale;

  // form.clearcoatMap = material.clearcoatMap;
  // form.clearcoatNormalMap = material.clearcoatNormalMap;

  form.clearcoatNormalScale.x = material.clearcoatNormalScale.x;
  form.clearcoatNormalScale.y = material.clearcoatNormalScale.y;
  // form.clearcoatRoughnessMap = material.clearcoatRoughnessMap;

  // form.displacementMap = material.displacementMap;
  form.displacementScale = material.displacementScale;


  // form.normalMap= material.normalMap;
  form.normalScale.x = material.normalScale.x;
  form.normalScale.y = material.normalScale.y;


  // form.roughnessMap= material.roughnessMap;
  // form.metalnessMap= material.metalnessMap;

  // form.iridescenceMap= material.iridescenceMap;
  // form.sheenColorMap= material.sheenColorMap;
  // form.sheenRoughnessMap= material.sheenRoughnessMap;

  // form.iridescenceThicknessMap= material.iridescenceThicknessMap;
  form.iridescenceThicknessRange = material.iridescenceThicknessRange;

  // form.envMap= material.envMap;
  // form.lightMap= material.lightMap;
  // form.aoMap= material.aoMap;
  form.aoMapIntensity = material.aoMapIntensity;

  // form.transmissionMap= material.transmissionMap;
  // form.thicknessMap= material.thicknessMap;

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
  <el-form :label-width="80" :model="form" label-position="left" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <input-item label="名称" name="name"/>

    <color-item label="颜色" name="color"/>
    <color-item label="自发光" name="emissive"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2  }" label="自发光强度" name="emissiveIntensity"/>

    <!--    todo 值联动-->
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="反射率" name="reflectivity"/>
    <input-number-item label="IOR" name="ior"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="粗糙度" name="roughness"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="金属度" name="metalness"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="清漆" name="clearcoat"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="清漆粗糙度" name="clearcoatroughness"/>
    <input-number-item :formProps="{max:10,min:0,step:0.01,precision:2 }" label="色散" name="dispersion"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="彩虹色" name="iridescence"/>
    <input-number-item :formProps="{max:5,min:0,step:0.01,precision:2 }" label="彩虹色折射率" name="iridescenceIOR"/>
    <vector2-item :formProps="{max:5,min:0,step:1}" label="彩虹色厚度" name="iridescenceThicknessRange"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="光泽" name="sheen"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="光泽粗超度" name="sheenRoughness"/>
    <color-item label="光泽颜色" name="sheenColor"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="透光" name="transmission"/>
    <input-number-item label="衰减距离" name="attenuationDistance"/>
    <color-item label="衰减色" name="attenuationColor"/>

    <input-number-item :formProps="{step:0.01,precision:2 }" label="厚度" name="thickness"/>
    <bool-item label="顶点颜色" name="vertexColors"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="自发光贴图" name="emissiveMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="凹凸贴图" name="bumpMap"/>
    <input-number-item label="凹凸缩放" name="bumpScale"/>

    <texture-item label="法线贴图" name="bumpMap"/>
    <vector2-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="法线缩放" name="normalScale"/>

    <texture-item label="清漆贴图" name="clearcoatMap"/>
    <texture-item label="清漆法线贴图" name="clearcoatNormalMap"/>
    <vector2-item label="清漆法线贴图缩放" name="clearcoatNormalScale"/>
    <texture-item label="清漆粗超度贴图" name="clearcoatRoughnessMap"/>

    <texture-item label="置换贴图" name="displacementMap"/>
    <input-number-item label="置换缩放" name="displacementScale"/>

    <texture-item label="粗糙贴图" name="roughnessMap"/>
    <texture-item label="金属贴图" name="metalnessMap"/>

    <texture-item label="彩虹色贴图" name="iridescenceMap"/>
    <texture-item label="光泽颜色贴图" name="sheenColorMap"/>
    <texture-item label="光泽粗超度贴图" name="sheenRoughnessMap"/>

    <texture-item label="彩虹色厚度贴图" name="iridescenceThicknessMap"/>
    <vector2-item :formProps="{step:1}" label="彩虹色厚度贴图缩放" name="iridescenceThicknessRange"/>

    <texture-item label="环境贴图" name="envMap"/>
    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="环境光遮蔽贴图强度"
                       name="aoMapIntensity"/>

    <texture-item label="透光贴图" name="transmissionMap"/>
    <texture-item label="厚度贴图" name="thicknessMap"/>

    <select-item :options="sideOptions" label="面" name="side"/>

    <bool-item label="平面着色" name="flatShading"/>

    <select-item :options="blendingOptions" label="混合" name="blending"/>

    <input-number-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="透明度" name="opacity"/>
    <bool-item label="透明性" name="transparent"/>

    <bool-item label="强制单通道" name="forceSinglePass"/>

    <bool-item :formProps="{max:1,min:0,step:0.01,precision:2 }" label="α测试" name="alphaTest"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓写" name="depthWrite"/>

    <bool-item label="线宽" name="wireframe"/>
  </el-form>

</template>

<style scoped>
:deep(.el-form-item--small .el-form-item__label) {
  height: max-content;
}
</style>