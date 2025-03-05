<script lang="ts" setup>
import {reactive} from "vue";
import {ElCol, ElRow} from "element-plus";
import {useBus} from "../../hooks";
import {getStatistics} from "@plum-render/three-sdk";
import {throttleTime} from "rxjs";
import {useStore} from "../../store/store.ts";

const bus = useBus();

const info = reactive({
  objects: 0,
  vertices: 0,
  triangles: 0,
  frameTime: 0
})
const store = useStore();

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
console.log("store.showSceneStatistics",store.showSceneStatistics)
</script>

<template>
  <div v-if="store.showSceneStatistics" class="absolute bottom-0 left-[90px] z-999 color-white w-[140px]">
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