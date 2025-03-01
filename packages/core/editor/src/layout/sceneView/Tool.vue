<script lang="ts" setup>
import {onMounted, reactive} from "vue";
import {ElButton, ElCol, ElForm, ElPopover, ElRow} from "element-plus";
import {useBus} from "../../hooks";
import {BoolItem, InputNumberItem} from "../../common-ui";
import {getStatistics} from "@plum-render/three-sdk";
import {throttleTime} from "rxjs";

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
  // form.distance = viewer.threeCameraControls.cameraControls.minDistance;

  form.axes = viewer.enableAxes;
}

const info = reactive({
  objects: 0,
  vertices: 0,
  triangles: 0,
  frameTime: 0
})

bus.objectAttributeChangeSubject.subscribe((object) => {
  const {name, value} = object;
  const viewer = bus.viewer;
  if (!viewer) return;
  if (name === "fps") {
    viewer.debug.enable = value;
  } else if (name === "statistics") {
    form.statistics = value;
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
      <el-button class="absolute top-[20px] right-[200px] z-999 ">调试</el-button>
    </template>
    <el-form :model="form" class="h-full" label-width="auto" size="small">
      <bool-item label="帧率" name="fps"/>
      <input-number-item label="渲染信息" name="statistics"/>
      <bool-item label="网格显示" name="grid"/>
      <input-number-item label="网格大小" name="distance"/>
      <bool-item label="坐标轴显示" name="axes"/>
      <input-number-item label="坐标轴大小" name="size"/>
    </el-form>
  </el-popover>

  <div v-if="form.statistics" class="absolute bottom-0 left-[100px] z-999 color-white w-[120px]">
    <el-row>
      <el-col :span="12">
        物体
      </el-col>
      <el-col :span="12">
        {{ info.objects }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        顶点
      </el-col>
      <el-col :span="12">
        {{ info.vertices }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        三角形
      </el-col>
      <el-col :span="12">
        {{ info.triangles }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        渲染时间
      </el-col>
      <el-col :span="12">
        {{ info.frameTime.toFixed(1) }}
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>
