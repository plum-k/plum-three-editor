<script lang="ts" setup>
import {ElEmpty, ElForm} from "element-plus";
import {computed, inject, onMounted, reactive, ref} from "vue";
import {isArray, set} from "lodash-es";
import * as THREE from "three";
import {isMesh} from "three-is";
import {useBus} from "../../../hooks";
import {BoolItem, ColorItem, InputNumberItem, SelectItem, TextItem, Vector2Item} from "../../../common-ui";
import TextureItem from "../../../common-ui/attributeItem/TextureItem.vue";

const bus = useBus();

const tabActiveName = inject("tabActiveName", ref("材质"))

const isActive = computed(() => {
  return tabActiveName.value === "材质"
})
const isVisible = ref(false);
bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    console.log("监听材质对象")
    // 监听对象选中
    viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
      console.log("更新材质对象", object);
      if (object && isActive.value) {
        isVisible.value = true;
        threeSyncUi(object);
      } else {
        isVisible.value = false;
      }
    })
  }
})

const sync = () => {

  const viewer = bus.viewer;
  const object = bus.selectObject;
  console.log("更新材质对象", object);
  if (object && isMesh(object) && isActive.value) {
    isVisible.value = true;
    threeSyncUi(object);
  } else {
    isVisible.value = false;
  }
}


onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();
  viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
    sync();
  })
})

// ui -> three
bus.objectAttributeChangeSubject.subscribe((editValue) => {
  console.log(editValue)
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

  emissive: '',
  emissiveIntensity: 0,

  roughness: 0,
  metalness: 0,

  vertexColors: false,


  transparent: false,
  opacity: 1,
  depthTest: true,
  depthWrite: true,
  wireframe: false,
  fog: false,
  alphaTest: 0,

  lightMapIntensity: 1,
  aoMapIntensity: 1,
  envMapIntensity: 1,
  bumpScale: 1,
  displacementScale: 1,
  normalScale: new THREE.Vector2(1, 1),
  emissiveIntensity: 1,
  ior: 1,
  transmission: 0,
  thickness: 1,
  attenuationDistance: 1,
  anisotropy: 0,
  anisotropyRotation: 0,
  iridescence: 0,
  iridescenceIOR: 1,
  sheen: 0,
  sheenRoughness: 0,
  specularIntensity: 1,
  specular: new THREE.Color(1, 1, 1),
  size: 1,
  flatShading: false,
  premultipliedAlpha: false,
  visible: true,
  dispersion: 0,
  depthPacking: false,
  reflectivity: 0,
  refractionRatio: 1,
})

// ui -> three
const threeSyncUi = (object: THREE.Mesh) => {
  const _material = object.material;
  const material: THREE.MeshStandardMaterial = isArray(_material) ? _material[0] as THREE.MeshStandardMaterial : _material as THREE.MeshStandardMaterial;

  form.type = material.type;
  form.uuid = material.uuid;
  form.name = material.name;

  form.color = material.color.getHexString();
  form.emissive = material.emissive.getHexString();
  form.emissiveIntensity = material.emissiveIntensity;

  form.roughness = material.roughness;
  form.metalness = material.metalness;

  form.vertexColors = material.vertexColors;

  form.map = material.map;
  form.emissiveMap = material.emissiveMap;
  form.alphaMap = material.alphaMap;

  form.bumpMap = material.bumpMap;
  form.bumpScale = material.bumpScale;

  form.normalMap= material.normalMap;
  form.normalScale.x= material.normalScale.x;
  form.normalScale.y= material.normalScale.y;

  form.displacementMap= material.displacementMap;
  form.displacementScale = material.displacementScale;

  form.roughnessMap= material.roughnessMap;
  form.metalnessMap= material.metalnessMap;

  form.envMap= material.envMap;
  form.lightMap= material.lightMap;
  form.aoMap= material.aoMap;
  form.aoMapIntensity= material.aoMapIntensity;

  form.side= material.side;
  form.flatShading= material.flatShading;
  form.blending= material.blending;
  form.opacity= material.opacity;
  form.transparent = material.transparent;

  form.forceSinglePass = material.forceSinglePass;

  form.alphaTest = material.alphaTest;
  form.depthTest = material.depthTest;
  form.depthWrite = material.depthWrite;

  form.wireframe = material.wireframe;

  console.log(form)
}
</script>

<template>
  <el-form v-if="isVisible" :model="form" label-position="left" label-width="auto" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <text-item label="名称" name="name"/>

    <color-item label="颜色" name="color"/>
    <color-item label="自发光" name="emissive"/>
    <input-number-item label="自发光强度" name="emissiveIntensity"/>

    <input-number-item label="粗糙度" name="roughness"/>
    <input-number-item label="金属度" name="metalness"/>
    <bool-item label="顶点颜色" name="vertexColors"/>

    <texture-item label="贴图" name="map"/>
    <texture-item label="自发光贴图" name="emissiveMap"/>
    <texture-item label="透明贴图" name="alphaMap"/>

    <texture-item label="凹凸贴图" name="bumpMap"/>
    <input-number-item label="凹凸缩放" name="bumpScale"/>

    <texture-item label="法线贴图" name="bumpMap"/>
    <vector2-item label="法线影响缩放" name="normalScale"/>

    <texture-item label="置换贴图" name="displacementMap"/>
    <input-number-item label="置换缩放" name="displacementScale"/>

    <texture-item label="粗糙贴图" name="roughnessMap"/>
    <texture-item label="金属贴图" name="metalnessMap"/>

    <texture-item label="环境贴图" name="envMap"/>
    <texture-item label="光照贴图" name="lightMap"/>
    <texture-item label="环境光遮蔽贴图" name="aoMap"/>
    <input-number-item label="环境光遮蔽贴图强度" name="aoMapIntensity"/>

    <select-item label="面" name="envMapIntensity"/>

    <bool-item label="平面着色" name="flatShading"/>

    <select-item label="混合" name="blending"/>
    <input-number-item label="透明度" name="opacity"/>
    <bool-item label="透明性" name="transparent"/>

    <bool-item name="forceSinglePass" label="强制单通道"/>

    <bool-item name="alphaTest" label="α测试"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓写" name="depthWrite"/>

    <bool-item label="线宽" name="wireframe"/>
  </el-form>
  <div v-else class="h-full flex justify-center items-center">
    <el-empty description="未选择对象"/>
  </div>
</template>

<style scoped>

</style>