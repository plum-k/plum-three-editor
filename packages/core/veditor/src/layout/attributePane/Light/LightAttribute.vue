<script setup lang="ts">
import DirectionalLightAttribute from "./DirectionalLightAttribute.vue";
import HemisphereLightAttribute from "./HemisphereLightAttribute.vue";
import SpotLightAttribute from "./SpotLightAttribute.vue";
import AmbientLightAttribute from "./AmbientLightAttribute.vue";
import PointLightAttribute from "./PointLightAttribute.vue";
import {onMounted, reactive} from "vue";
import isDirectionalLight from "three-is/src/lights/isDirectionalLight.ts";
import {useBus} from "../../../hooks";
import {isAmbientLight, isHemisphereLight, isPointLight, isSpotLight} from "three-is";

const bus = useBus();
const show = reactive({
  isDirectionalLight: false,
  isHemisphereLight: false,
  isPointLight: false,
  isSpotLight: false,
  isAmbientLight: false,
})
const sync = () => {
  const object = bus.selectObject;
  show.isDirectionalLight = isDirectionalLight(object)
  show.isHemisphereLight = isHemisphereLight(object)
  show.isPointLight = isPointLight(object)
  show.isSpotLight = isSpotLight(object)
  show.isAmbientLight = isAmbientLight(object)
}
onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return
  viewer.editor.editorEventManager.objectSelected.subscribe((object) => {
    sync();
  })
})

</script>

<template>
  <AmbientLightAttribute v-if="show.isAmbientLight"/>
  <DirectionalLightAttribute v-else-if="show.isDirectionalLight"/>
  <HemisphereLightAttribute v-else-if="show.isHemisphereLight"/>
  <PointLightAttribute v-else-if="show.isPointLight"/>
  <SpotLightAttribute v-else-if="show.isSpotLight"/>
</template>

<style scoped>

</style>