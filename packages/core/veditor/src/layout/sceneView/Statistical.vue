<script lang="ts" setup>
import {useBus} from "../../hooks";
import {onMounted, reactive} from "vue";
import {getStatistics} from "@plum-render/three-sdk";
import {throttleTime} from "rxjs";
import {ElCol, ElRow} from "element-plus";

const bus = useBus();
const form = reactive({
  objects: 0,
  vertices: 0,
  triangles: 0,
  frameTime: 0
})

bus.viewerInitSubject.subscribe(() => {
  const viewer = bus.viewer;
  if (!viewer) return
  viewer.editor.editorEventManager.sceneGraphChanged.subscribe(() => {
    let statistics = getStatistics(viewer.scene)
    form.objects = statistics.objects;
    form.vertices = statistics.vertices;
    form.triangles = statistics.triangles;
  })
  viewer.loop.sceneRendered.pipe(throttleTime(1000)).subscribe((value) => {
    form.frameTime = value
  })
})
onMounted(() => {

})

</script>

<template>
  <div class="absolute bottom-0 left-[100px] z-999 color-white w-[120px]">
    <el-row>
      <el-col :span="12">
        物体
      </el-col>
      <el-col :span="12">
        {{ form.objects }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        顶点
      </el-col>
      <el-col :span="12">
        {{ form.vertices }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        三角形
      </el-col>
      <el-col :span="12">
        {{ form.triangles }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        渲染时间
      </el-col>
      <el-col :span="12">
        {{ form.frameTime.toFixed(1) }}
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>