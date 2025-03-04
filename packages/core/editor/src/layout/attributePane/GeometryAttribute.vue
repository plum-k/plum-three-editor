<script lang="ts" setup>
import {ElEmpty} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import {isNil} from "lodash-es";
import {
  isBoxGeometry,
  isBufferGeometry,
  isCapsuleGeometry,
  isCircleGeometry,
  isCylinderGeometry,
  isDodecahedronGeometry,
  isExtrudeGeometry,
  isIcosahedronGeometry,
  isLatheGeometry,
  isMesh,
  isModifiers,
  isOctahedronGeometry,
  isPlaneGeometry,
  isRingGeometry,
  isShapeGeometry,
  isSphereGeometry,
  isTetrahedronGeometry
} from "three-is";
import {useBus} from "../../hooks";
import BoxGeometryAttribute from "./geometryAttribute/BoxGeometryAttribute.vue";
import BufferGeometryAttribute from "./geometryAttribute/BufferGeometryAttribute.vue";
import CapsuleGeometryAttribute from "./geometryAttribute/CapsuleGeometryAttribute.vue";
import CircleGeometryAttribute from "./geometryAttribute/CircleGeometryAttribute.vue";
import CylinderGeometryAttribute from "./geometryAttribute/CylinderGeometryAttribute.vue";
import DodecahedronGeometryAttribute from "./geometryAttribute/DodecahedronGeometryAttribute.vue";
import ExtrudeGeometryAttribute from "./geometryAttribute/ExtrudeGeometryAttribute.vue";
import IcosahedronGeometryAttribute from "./geometryAttribute/IcosahedronGeometryAttribute.vue";
import LatheGeometryAttribute from "./geometryAttribute/LatheGeometryAttribute.vue";
import ModifiersAttribute from "./geometryAttribute/ModifiersAttribute.vue";
import OctahedronGeometryAttribute from "./geometryAttribute/OctahedronGeometryAttribute.vue";
import PlaneGeometryAttribute from "./geometryAttribute/PlaneGeometryAttribute.vue";
import RingGeometryAttribute from "./geometryAttribute/RingGeometryAttribute.vue";
import ShapeGeometryAttribute from "./geometryAttribute/ShapeGeometryAttribute.vue";
import SphereGeometryAttribute from "./geometryAttribute/SphereGeometryAttribute.vue";
import TetrahedronGeometryAttribute from "./geometryAttribute/TetrahedronGeometryAttribute.vue";
import TorusGeometryAttribute from "./geometryAttribute/TorusGeometryAttribute.vue";
import TubeGeometryAttribute from "./geometryAttribute/TubeGeometryAttribute.vue";
import TorusKnotGeometryAttribute from "./geometryAttribute/TorusKnotGeometryAttribute.vue";

// const {isActive} = useAttributePane(props)
const bus = useBus();
// const props = defineProps<AttributePaneNameProps>();

const show = ref(true);
const text = ref("未选择对象");
// 定义材质的显示状态
const geometryShow = reactive({
  isBoxGeometry: false,
  isBufferGeometry: false,
  isCapsuleGeometry: false,
  isCircleGeometry: false,
  isCylinderGeometry: false,
  isDodecahedronGeometry: false,
  isExtrudeGeometry: false,
  isIcosahedronGeometry: false,
  isLatheGeometry: false,
  isModifiers: false,
  isOctahedronGeometry: false,
  isPlaneGeometry: false,
  isRingGeometry: false,
  isShapeGeometry: false,
  isSphereGeometry: false,
  isTetrahedronGeometry: false,
  isTorusGeometry: false,
  isTorusKnotGeometry: false,
  isTubeGeometry: false,
});

// 同步材质状态的函数
const sync = () => {
  const object = bus.selectObject;
  if (isNil(object)) {
    show.value = true;
    text.value = "未选择对象";
    return;
  }
  if (isMesh(object)) {
    show.value = false;
    const geometry = object.geometry;
    geometryShow.isBoxGeometry = isBoxGeometry(geometry)
    geometryShow.isBufferGeometry = isBufferGeometry(geometry)
    geometryShow.isCapsuleGeometry = isCapsuleGeometry(geometry)
    geometryShow.isCircleGeometry = isCircleGeometry(geometry)
    geometryShow.isCylinderGeometry = isCylinderGeometry(geometry)
    geometryShow.isDodecahedronGeometry = isDodecahedronGeometry(geometry)
    geometryShow.isExtrudeGeometry = isExtrudeGeometry(geometry)
    geometryShow.isIcosahedronGeometry = isIcosahedronGeometry(geometry)
    geometryShow.isLatheGeometry = isLatheGeometry(geometry)
    geometryShow.isModifiers = isModifiers(geometry)
    geometryShow.isOctahedronGeometry = isOctahedronGeometry(geometry)
    geometryShow.isPlaneGeometry = isPlaneGeometry(geometry)
    geometryShow.isRingGeometry = isRingGeometry(geometry)
    geometryShow.isShapeGeometry = isShapeGeometry(geometry)
    geometryShow.isSphereGeometry = isSphereGeometry(geometry)
    geometryShow.isTetrahedronGeometry = isTetrahedronGeometry(geometry)
  } else {
    show.value = true;
    text.value = "对象不是网格体";
  }
};
bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (viewer) {
    viewer.editor.editorEventManager.objectSelected.subscribe(() => {
      sync();
    })
    sync();
  }
})
onMounted(() => {
  const viewer = bus.viewer;
  if (!viewer) return;
  sync();
  viewer.editor.editorEventManager.objectSelected.subscribe(() => {
    sync();

  })
})
</script>

<template>
  <div v-if="show" class="h-full flex justify-center items-center">
    <el-empty :description="text"/>
  </div>
  <box-geometry-attribute v-else-if="geometryShow.isBoxGeometry"/>
  <capsule-geometry-attribute v-else-if="geometryShow.isCapsuleGeometry"/>
  <circle-geometry-attribute v-else-if="geometryShow.isCircleGeometry"/>
  <cylinder-geometry-attribute v-else-if="geometryShow.isCylinderGeometry"/>

  <dodecahedron-geometry-attribute v-else-if="geometryShow.isDodecahedronGeometry"/>
  <extrude-geometry-attribute v-else-if="geometryShow.isExtrudeGeometry"/>
  <icosahedron-geometry-attribute v-else-if="geometryShow.isIcosahedronGeometry"/>
  <lathe-geometry-attribute v-else-if="geometryShow.isLatheGeometry"/>

  <modifiers-attribute v-else-if="geometryShow.isModifiers"/>
  <octahedron-geometry-attribute v-else-if="geometryShow.isOctahedronGeometry"/>
  <plane-geometry-attribute v-else-if="geometryShow.isPlaneGeometry"/>
  <ring-geometry-attribute v-else-if="geometryShow.isRingGeometry"/>
  <shape-geometry-attribute v-else-if="geometryShow.isShapeGeometry"/>

  <sphere-geometry-attribute v-else-if="geometryShow.isSphereGeometry"/>
  <tetrahedron-geometry-attribute v-else-if="geometryShow.isTetrahedronGeometry"/>
  <torus-geometry-attribute v-else-if="geometryShow.isTorusGeometry"/>
  <torus-knot-geometry-attribute v-else-if="geometryShow.isTorusKnotGeometry"/>
  <tube-geometry-attribute v-else-if="geometryShow.isTubeGeometry"/>
  <buffer-geometry-attribute v-else-if="geometryShow.isBufferGeometry"/>
</template>
<style scoped>

</style>