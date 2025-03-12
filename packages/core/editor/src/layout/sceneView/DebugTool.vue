<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import {ElButton, ElForm, ElPopover} from "element-plus";
import {useAttributeProvide, useBus} from "../../hooks";
import {BoolItem, InputNumberItem} from "../../common-ui";
import {getStatistics} from "@plum-render/three-sdk";
import {throttleTime} from "rxjs";
import {useStore} from "../../store/store.ts";

const bus = useBus();
const form = reactive({
  fps: false,
  statistics: false,

  grid: false,
  distance: 100,

  axes: false,
  size: 100,
})

const show = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
  form.fps = viewer.debug.enable;

  form.grid = viewer.enableGrid;
  // form.distance = viewer.cameraManager.cameraControls.minDistance;

  form.axes = viewer.enableAxes;
}

const info = reactive({
  objects: 0,
  vertices: 0,
  triangles: 0,
  frameTime: 0
})
const {setShowSceneStatistics} = useStore();
const {objectAttributeChangeSubject} = useAttributeProvide({
  isAutoUpdate: true,
  getObject: () => {
    return form
  }
})
objectAttributeChangeSubject.subscribe((object) => {
  const {name, value} = object;
  const viewer = bus.viewer;
  if (!viewer) return;
  if (name === "fps") {
    viewer.debug.enable = value;
  } else if (name === "statistics") {
    form.statistics = value;
    setShowSceneStatistics(value)
  } else if (name === "grid") {
    viewer.enableGrid = value;
  } else if (name === "axes") {
    viewer.enableAxes = value;
  }
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (!viewer) return
  viewer.editor.editorEventManager.sceneGraphChanged.subscribe(() => {
    let statistics = getStatistics(viewer.scene)
    info.objects = statistics.objects;
    info.vertices = statistics.vertices;
    info.triangles = statistics.triangles;
  })
  viewer.loop.sceneRendered.pipe(throttleTime(1000)).subscribe((value) => {
    info.frameTime = value
  })
})
onMounted(() => {

})
</script>

<template>
  <el-popover
      :width="200"
      placement="bottom"
      trigger="click"
      @show="show"
  >
    <template #reference>
      <el-button class="z-999" text>调试</el-button>
    </template>
    <el-form  class="h-full" label-width="auto" size="small">
<!--      <bool-item label="帧率" name="fps"/>-->
<!--      <bool-item label="渲染信息" name="statistics"/>-->
<!--      <bool-item label="网格显示" name="grid"/>-->
<!--      <input-number-item label="网格大小" name="distance"/>-->
<!--      <bool-item label="坐标轴显示" name="axes"/>-->
<!--      <input-number-item label="坐标轴大小" name="size"/>-->
    </el-form>
  </el-popover>

</template>

<style scoped>

</style>
