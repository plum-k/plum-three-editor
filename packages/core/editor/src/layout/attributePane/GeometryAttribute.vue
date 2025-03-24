<script lang="ts" setup>
import {ElEmpty} from "element-plus";
import {reactive, ref, watch} from "vue";
import {isNil} from "lodash-es";
import {
  isBoxGeometry,
  isBufferGeometry,
  isCapsuleGeometry,
  isCircleGeometry,
  isCylinderGeometry,
  isDodecahedronGeometry,
  isIcosahedronGeometry,
  isMesh,
  isOctahedronGeometry,
  isPlaneGeometry,
  isRingGeometry,
  isSphereGeometry,
  isTetrahedronGeometry
} from "three-is";
import {useBus} from "../../hooks";
import {
  BoxGeometryAttribute,
  BufferGeometryAttribute,
  CapsuleGeometryAttribute,
  CircleGeometryAttribute,
  CylinderGeometryAttribute,
  DodecahedronGeometryAttribute,
  IcosahedronGeometryAttribute,
  OctahedronGeometryAttribute,
  PlaneGeometryAttribute,
  RingGeometryAttribute,
  SphereGeometryAttribute,
  TetrahedronGeometryAttribute,
  TorusGeometryAttribute,
  TorusKnotGeometryAttribute,
} from "./geometryAttribute";
import {type AttributePaneNameProps, useAttributePane} from "./useAttributePane.ts";
import {useBindSubscribe} from "../../hooks/useBindSubscribe.ts";

const bus = useBus();
const showEmpty = ref(true);
const text = ref("未选择对象");

const props = defineProps<AttributePaneNameProps>();
const {isActive} = useAttributePane(props)

watch(isActive, (value) => {
  value && sync();

})

const show = reactive({
  isBoxGeometry: false,
  isBufferGeometry: false,
  isCapsuleGeometry: false,
  isCircleGeometry: false,
  isCylinderGeometry: false,
  isDodecahedronGeometry: false,
  isExtrudeGeometry: false,
  isIcosahedronGeometry: false,
  isLatheGeometry: false,
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
    showEmpty.value = true;
    text.value = "未选择对象";
    return;
  }
  if (isMesh(object)) {
    showEmpty.value = false;
    const geometry = object.geometry;
    show.isBoxGeometry = isBoxGeometry(geometry)
    show.isBufferGeometry = isBufferGeometry(geometry)
    show.isCapsuleGeometry = isCapsuleGeometry(geometry)
    show.isCircleGeometry = isCircleGeometry(geometry)
    show.isCylinderGeometry = isCylinderGeometry(geometry)
    show.isDodecahedronGeometry = isDodecahedronGeometry(geometry)
    show.isIcosahedronGeometry = isIcosahedronGeometry(geometry)
    show.isOctahedronGeometry = isOctahedronGeometry(geometry)
    show.isPlaneGeometry = isPlaneGeometry(geometry)
    show.isRingGeometry = isRingGeometry(geometry)
    show.isSphereGeometry = isSphereGeometry(geometry)
    show.isTetrahedronGeometry = isTetrahedronGeometry(geometry)
  } else {
    showEmpty.value = true;
    text.value = "对象不是网格体";
  }
};
const {} = useBindSubscribe({
  fun: sync,
  isMounted: false,
  isViewerInit: true,
  isBindCallFun: false,
})
</script>

<template>
  <div v-if="showEmpty" class="h-full flex justify-center items-center">
    <el-empty :description="text"/>
  </div>
  <box-geometry-attribute v-else-if="show.isBoxGeometry"/>
  <capsule-geometry-attribute v-else-if="show.isCapsuleGeometry"/>
  <circle-geometry-attribute v-else-if="show.isCircleGeometry"/>
  <cylinder-geometry-attribute v-else-if="show.isCylinderGeometry"/>

  <dodecahedron-geometry-attribute v-else-if="show.isDodecahedronGeometry"/>
  <icosahedron-geometry-attribute v-else-if="show.isIcosahedronGeometry"/>

  <octahedron-geometry-attribute v-else-if="show.isOctahedronGeometry"/>
  <plane-geometry-attribute v-else-if="show.isPlaneGeometry"/>
  <ring-geometry-attribute v-else-if="show.isRingGeometry"/>

  <sphere-geometry-attribute v-else-if="show.isSphereGeometry"/>
  <tetrahedron-geometry-attribute v-else-if="show.isTetrahedronGeometry"/>
  <torus-geometry-attribute v-else-if="show.isTorusGeometry"/>
  <torus-knot-geometry-attribute v-else-if="show.isTorusKnotGeometry"/>
  <buffer-geometry-attribute v-else-if="show.isBufferGeometry"/>
</template>
<style scoped>

</style>