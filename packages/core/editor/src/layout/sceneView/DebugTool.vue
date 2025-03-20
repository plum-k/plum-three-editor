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

  lightHelpers: true,
  skeletonHelpers: true,
})

const show = () => {
  const viewer = bus.viewer;
  if (!viewer) return;
  form.fps = viewer.debug.enable;
  form.grid = viewer.isEnableGrid;
  form.axes = viewer.isEnableAxes;
  form.lightHelpers = viewer.editor.appearanceStates.lightHelpers;
  form.skeletonHelpers = viewer.editor.appearanceStates.skeletonHelpers;
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
  } else if (["grid", "distance"].includes(name as string)) {
    viewer.setGrid({
      visible: value,
      fadeDistance: form.distance,
    })
  } else if (["size", "axes"].includes(name as string)) {
    viewer.setAxes({
      visible: value,
      size: form.size,
    })
  } else if (["lightHelpers", "skeletonHelpers"].includes(name as string)) {
    viewer.editor.showHelper({
      cameraHelpers: false,
      lightHelpers: form.lightHelpers,
      skeletonHelpers: form.skeletonHelpers,
    })
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
    <el-form class="h-full" label-width="auto" size="small">
      <bool-item v-model="form.fps" label="帧率" name="fps"/>
      <bool-item v-model="form.statistics" label="渲染信息" name="statistics"/>
      <bool-item v-model="form.grid" label="网格显示" name="grid"/>
      <input-number-item v-model="form.distance" label="网格大小" name="distance"/>
      <bool-item v-model="form.axes" label="坐标轴显示" name="axes"/>
      <input-number-item v-model="form.size" label="坐标轴大小" name="size"/>

      <bool-item v-model="form.lightHelpers" label="灯光帮助显示" name="lightHelpers"/>
      <bool-item v-model="form.skeletonHelpers" label="骨骼帮助显示" name="skeletonHelpers"/>
    </el-form>
  </el-popover>

</template>

<style scoped>

</style>
