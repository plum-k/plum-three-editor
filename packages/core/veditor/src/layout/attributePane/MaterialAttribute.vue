<script setup lang="ts">
import {useBus} from "../../hooks";
import {ElEmpty, ElForm} from "element-plus";
import {BoolItem, InputNumberItem, TextItem} from "../../common-ui";
import {reactive, ref} from "vue";
import {isArray, set} from "lodash-es";
import * as THREE from "three";
import {
  isMeshBasicMaterial, isMeshNormalMaterial,
  isMeshPhongMaterial,
  isMeshPhysicalMaterial,
  isMeshStandardMaterial,
  isMeshToonMaterial,
  isPointsMaterial
} from "three-is";

const bus = useBus();
const isVisible = ref(false);
bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    console.log("监听材质对象")
    // 监听对象选中
    viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
      console.log("更新材质对象", object);
      if (object) {
        isVisible.value = true;
        threeSyncUi(object);
      }else {
        isVisible.value = false;
      }
    })
  }
})
// ui -> three
bus.objectAttributeChangeSubject.subscribe((editValue) => {
  console.log(editValue)
  const {name, value} = editValue;
  const object = bus.selectObject;
  if (!object) return;

  set(object, name, value);
})
const form = reactive({
  type: '',
  uuid: '',
  name: '',
  transparent: false,
  opacity: 1,
  depthTest: true,
  depthWrite: true,
  wireframe: false,
  fog: false,
  alphaTest: 0,
  roughness: 0,
  metalness: 0,
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
  vertexColors: false,
  visible: true,
  dispersion: 0,
  depthPacking: false,
  reflectivity: 0,
  refractionRatio: 1,
})
// ui -> three
const threeSyncUi = (object: THREE.Mesh) => {
  const _material = object.material;
  const material = isArray(_material) ? _material[0] : _material;

  const isMeshBasicMaterialType = isMeshBasicMaterial(material);
  const isMeshPhysicalMaterialType = isMeshPhysicalMaterial(material); //物理网格材质
  const isMeshPhongMaterialType = isMeshPhongMaterial(material);
  const isPointsMaterialType = isPointsMaterial(material);
  const isMeshToonMaterialType = isMeshToonMaterial(material);
  const isMeshStandardMaterialType = isMeshStandardMaterial(material);
  const isMeshNormalMaterialType = isMeshNormalMaterial(material);


  form.type = material.type;
  form.uuid = material.uuid;
  form.name = material.name;
  form.transparent = material.transparent;
  form.opacity = material.opacity;
  form.alphaTest = material.alphaTest;
  form.premultipliedAlpha = material.premultipliedAlpha;
  form.vertexColors = material.vertexColors;
  form.visible = material.visible;
  form.depthTest = material.depthTest;
  form.depthWrite = material.depthWrite;

  if (isMeshBasicMaterialType) {
    form.wireframe = material.wireframe;

  }


  if (isMeshStandardMaterialType) {
    form.roughness = material.roughness;
    form.metalness = material.metalness;
  }

  if (isMeshPhysicalMaterialType) {
    form.anisotropy = material.anisotropy;
    form.anisotropyRotation = material.anisotropyRotation;
    form.iridescence = material.iridescence;
    form.iridescenceIOR = material.iridescenceIOR;
    form.reflectivity = material.reflectivity;

    // 光泽
    form.sheen = material.sheen;
    form.sheenRoughness = material.sheenRoughness;

    // 为非金属材质所设置的折射率
    form.ior = material.ior;
    form.transmission = material.transmission;

    // 用于控制非金属材质高光反射强度的浮点值
    form.specularIntensity = material.specularIntensity;
    //
  }

  if (isMeshNormalMaterialType) {
    form.normalScale = material.normalScale;

  }

  form.fog = material.fog;

  form.lightMapIntensity = material.lightMapIntensity;
  form.aoMapIntensity = material.aoMapIntensity;
  form.envMapIntensity = material.envMapIntensity;

  form.bumpScale = material.bumpScale;
  form.displacementScale = material.displacementScale;
  form.emissiveIntensity = material.emissiveIntensity;


  form.thickness = material.thickness;
  form.attenuationDistance = material.attenuationDistance;

  form.specular = material.specular;
  form.size = material.size;

  form.flatShading = material.flatShading;

  form.dispersion = material.dispersion;
  form.depthPacking = material.depthPacking;
  form.refractionRatio = material.refractionRatio;
  console.log(form)
}
</script>

<template>
  <el-form  v-if="isVisible"  :model="form" label-position="left" label-width="auto" size="small">
    <text-item label="类型" name="type"/>
    <text-item label="uuid" name="uuid"/>
    <text-item label="名称" name="name"/>

    <bool-item label="透明性" name="transparent"/>
    <input-number-item label="透明度" name="opacity"/>
    <bool-item label="深度测试" name="depthTest"/>
    <bool-item label="深度缓冲" name="depthWrite"/>
    <bool-item label="线宽" name="wireframe"/>
    <bool-item label="雾影响" name="fog"/>

    <input-number-item label="α测试" name="alphaTest"/>

    <!--    -->
    <input-number-item label="粗糙度" name="roughness"/>
    <input-number-item label="金属度" name="metalness"/>

    <!--    -->
    <input-number-item label="光照强度" name="lightMapIntensity"/>
    <input-number-item label="环境光遮蔽贴图强度" name="aoMapIntensity"/>
    <input-number-item label="环境贴图强度" name="envMapIntensity"/>
    <!--    -->
    <input-number-item label="凹凸缩放" name="bumpScale"/>
    <input-number-item label="置换缩放" name="displacementScale"/>
    <!--    <input-number-item label="法线影响缩放" name="normalScale"/>-->

    <!--    -->
    <input-number-item label="自发光强度" name="emissiveIntensity"/>
    <!--    -->
    <input-number-item label="折射率" name="ior"/>
    <input-number-item label="透光率" name="transmission"/>
    <input-number-item label="厚度" name="thickness"/>
    <input-number-item label="衰减距离" name="attenuationDistance"/>
    <!--  清漆  -->
    <!--    <input-number-item label="折射率" name="ior"/>-->
    <!--    <input-number-item label="折射率" name="ior"/>-->
    <!--    -->
    <input-number-item label="各向异性" name="anisotropy"/>
    <input-number-item label="各向异性旋转" name="anisotropyRotation"/>
    <!--    -->
    <input-number-item label="彩虹色强度" name="iridescence"/>
    <input-number-item label="彩虹色折射率" name="iridescenceIOR"/>
    <!--    -->
    <input-number-item label="光泽强度" name="sheen"/>
    <input-number-item label="光泽粗糙度" name="sheenRoughness"/>
    <!---->
    <input-number-item label="高光强度" name="specularIntensity"/>
    <!--    -->
    <!--    <input-number-item label="镜面" name="specular"/>-->

    <input-number-item label="大小" name="size"/>

    <bool-item label="平面着色" name="flatShading"/>
    <bool-item label="预乘透明" name="premultipliedAlpha"/>
    <!--    <input-number-item label="顶点色倍增" name="vertexColors"/>-->
    <bool-item label="可见性" name="visible"/>
    <!---->
    <input-number-item label="色散" name="dispersion"/>
    <!--    <input-number-item label="深度包装" name="depthPacking"/>-->
    <input-number-item label="反射率" name="reflectivity"/>
    <input-number-item label="折射比" name="refractionRatio"/>
  </el-form>
  <div v-else class="h-full flex justify-center items-center">
    <el-empty  description="未选择对象"/>
  </div>
</template>

<style scoped>

</style>