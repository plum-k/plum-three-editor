<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {
  isGroup,
  isLight,
  isLineBasicMaterial,
  isLineDashedMaterial, isMesh,
  isMeshBasicMaterial,
  isMeshDepthMaterial,
  isMeshLambertMaterial,
  isMeshMatcapMaterial,
  isMeshNormalMaterial,
  isMeshPhongMaterial,
  isMeshPhysicalMaterial,
  isMeshStandardMaterial,
  isMeshToonMaterial,
  isPointsMaterial,
  isRawShaderMaterial,
  isShaderMaterial,
  isShadowMaterial,
  isSpriteMaterial
} from "three-is";

import {isArray} from "lodash-es";


import * as THREE from "three";
import {
  LineBasicMaterialAttribute,
  LineDashedMaterialAttribute,
  MeshBasicMaterialAttribute,
  MeshDepthMaterialAttribute,
  MeshLambertMaterialAttribute,
  MeshMatcapMaterialAttribute,
  MeshNormalMaterialAttribute,
  MeshPhysicalMaterialAttribute,
  MeshStandardMaterialAttribute,
  MeshToonMaterialAttribute,
  PointsMaterialAttribute,
  RawShaderMaterialAttribute,
  ShaderMaterialAttribute,
  ShadowMaterialAttribute,
  SpriteMaterialAttribute
} from "./materialAttribute";
import {useBus} from "../../hooks";

// const {isActive} = useAttributePane(props)
const bus = useBus();

// const props = defineProps<AttributePaneNameProps>();
const isVisible = ref(false);
// 定义材质的显示状态
const materialShow = reactive({
  isLineBasicMaterial: false,
  isLineDashedMaterial: false,
  isMeshBasicMaterial: false,
  isMeshDepthMaterial: false,
  isMeshNormalMaterial: false,
  isMeshLambertMaterial: false,
  isMeshMatcapMaterial: false,
  isMeshPhongMaterial: false,
  isMeshToonMaterial: false,
  isMeshStandardMaterial: false,
  isMeshPhysicalMaterial: false,
  isRawShaderMaterial: false,
  isShaderMaterial: false,
  isShadowMaterial: false,
  isSpriteMaterial: false,
  isPointsMaterial: false,
});

// 同步材质状态的函数
const sync = () => {
  const object = bus.selectObject

  if (isMesh(object)) {
    const _material = object.material;
    const material = isArray(_material) ? _material[0] : _material;
    materialShow.isLineBasicMaterial = isLineBasicMaterial(material);
    materialShow.isLineDashedMaterial = isLineDashedMaterial(material);
    materialShow.isMeshBasicMaterial = isMeshBasicMaterial(material);
    materialShow.isMeshDepthMaterial = isMeshDepthMaterial(material);
    materialShow.isMeshNormalMaterial = isMeshNormalMaterial(material);
    materialShow.isMeshLambertMaterial = isMeshLambertMaterial(material);
    materialShow.isMeshMatcapMaterial = isMeshMatcapMaterial(material);
    materialShow.isMeshPhongMaterial = isMeshPhongMaterial(material);
    materialShow.isMeshToonMaterial = isMeshToonMaterial(material);
    materialShow.isMeshStandardMaterial = isMeshStandardMaterial(material);
    materialShow.isMeshPhysicalMaterial = isMeshPhysicalMaterial(material);
    materialShow.isRawShaderMaterial = isRawShaderMaterial(material);
    materialShow.isShaderMaterial = isShaderMaterial(material);
    materialShow.isShadowMaterial = isShadowMaterial(material);
    materialShow.isSpriteMaterial = isSpriteMaterial(material);
    materialShow.isPointsMaterial = isPointsMaterial(material);
    console.log("materialShow", materialShow)
  }
};

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    console.log("监听对象")
    sync();
    viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
      sync();
    })
  }
})


onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();
  viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
    sync();
  })
})
</script>

<template>
  <line-basic-material-attribute v-if="materialShow.isLineBasicMaterial"/>
  <line-dashed-material-attribute v-else-if="materialShow.isLineDashedMaterial"/>
  <mesh-basic-material-attribute v-else-if="materialShow.isMeshBasicMaterial"/>
  <mesh-depth-material-attribute v-else-if="materialShow.isMeshDepthMaterial"/>
  <mesh-lambert-material-attribute v-else-if="materialShow.isMeshLambertMaterial"/>
  <mesh-matcap-material-attribute v-else-if="materialShow.isMeshMatcapMaterial"/>
  <mesh-normal-material-attribute v-else-if="materialShow.isMeshNormalMaterial"/>
  <mesh-physical-material-attribute v-else-if="materialShow.isMeshPhysicalMaterial"/>
  <mesh-standard-material-attribute v-else-if="materialShow.isMeshStandardMaterial"/>
  <mesh-toon-material-attribute v-else-if="materialShow.isMeshToonMaterial"/>
  <points-material-attribute v-else-if="materialShow.isPointsMaterial"/>
  <raw-shader-material-attribute v-else-if="materialShow.isRawShaderMaterial"/>
  <shader-material-attribute v-else-if="materialShow.isShaderMaterial"/>
  <shadow-material-attribute v-else-if="materialShow.isShadowMaterial"/>
  <sprite-material-attribute v-else-if="materialShow.isSpriteMaterial"/>
</template>

<style scoped>

</style>