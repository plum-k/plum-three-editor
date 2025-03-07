<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {ElEmpty} from "element-plus";
import {useBus} from "../../hooks";
import {
  isAmbientLight,
  isDirectionalLight,
  isGroup,
  isHemisphereLight,
  isMesh,
  isObject3D,
  isPointLight,
  isSpotLight
} from "three-is";
import {type AttributePaneNameProps, useAttributePane} from "./useAttributePane.ts";
import {
  AmbientLightAttribute,
  DirectionalLightAttribute,
  HemisphereLightAttribute,
  Object3DAttribute,
  PointLightAttribute,
  SpotLightAttribute
} from "./objectAttribute";

const bus = useBus();
const props = defineProps<AttributePaneNameProps>();
const {isActive} = useAttributePane(props)

const showEmpty = ref(true);
watch(isActive, (value) => {
  value && sync();
})

const show = reactive({
  isMesh: false,
  isGroup: false,
  isObject3D: false,
  isDirectionalLight: false,
  isHemisphereLight: false,
  isPointLight: false,
  isSpotLight: false,
  isAmbientLight: false,
})

const sync = () => {
  const object = bus.selectObject;
  if (object) {
    showEmpty.value = false;
    show.isDirectionalLight = isDirectionalLight(object)
    show.isHemisphereLight = isHemisphereLight(object)
    show.isPointLight = isPointLight(object)
    show.isSpotLight = isSpotLight(object)
    show.isAmbientLight = isAmbientLight(object)
    show.isMesh = isMesh(object);
    show.isGroup = isGroup(object);
    show.isObject3D = isObject3D(object);
  } else {
    showEmpty.value = true;
  }
}
bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    viewer.editor.editorEventManager.objectSelected.subscribe(() => {
      sync();
    })
  }
})
</script>

<template>
  <div v-if="showEmpty" class="h-full flex justify-center items-center">
    <el-empty description="未选择对象"/>
  </div>
  <AmbientLightAttribute v-if="show.isAmbientLight"/>
  <DirectionalLightAttribute v-else-if="show.isDirectionalLight"/>
  <HemisphereLightAttribute v-else-if="show.isHemisphereLight"/>
  <PointLightAttribute v-else-if="show.isPointLight"/>
  <SpotLightAttribute v-else-if="show.isSpotLight"/>
  <object3-d-attribute v-else-if="show.isGroup || show.isMesh || show.isObject3D"/>
</template>

<style scoped>

</style>