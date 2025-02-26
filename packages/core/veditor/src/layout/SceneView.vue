<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Viewer} from "@plum-render/three-sdk";
import {useRoute} from "vue-router";
import {useAmbientLight} from "../testCore/useAmbientLight.ts";
import {BoxGeometry, Mesh, MeshStandardMaterial} from "three";
import {useBus, useSetViewer,} from "../hooks";
import {Control, SidePane, Statistical} from "./sceneView";
import type {IDragInfo} from "../interface/IDragInfo.ts";


const canvasContainer = ref<HTMLDivElement>();
const route = useRoute();

const id = route.params.appId as string;
const addBox = (_viewer, num) => {
  let cube;
  for (let i = 0; i < num; i++) {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({color: 0x00ff00});
    material.name = `测试材质${i}`
    cube = new Mesh(geometry, material);
    cube.name = `测试模型${i}`
    _viewer.scene.add(cube)
  }
  return cube;
}
onMounted(() => {
  console.log("初始化")
  if (!canvasContainer.value) return
  let _viewer!: Viewer
  if (id) {
    _viewer = new Viewer(canvasContainer.value, {
      // appUrl: "https://plum-1257591271.cos.ap-shanghai.myqcloud.com/test.zip"
    });
  } else {
    _viewer = new Viewer(canvasContainer.value, {
      // appUrl: "https://plum-1257591271.cos.ap-shanghai.myqcloud.com/test.zip"
    });
  }
  _viewer.assetManager.startSubject.subscribe((value) => {
    // setPercent(value.loaded / value.total)
  })

  _viewer.assetManager.progressSubject.subscribe((value) => {
    // todo
    // setPercent(value.loaded / value.total)
    // console.log(value.loaded / value.total)
    if (value.loaded === value.total) {

    }
  })

  // useLightTest(_viewer)

  _viewer.threeCameraControls.cameraControls.setPosition(5, 5, 5);
  _viewer.threeCameraControls.cameraControls.setTarget(0, 0, 0);

  addBox(_viewer, 1);


  setTimeout(() => {
    _viewer.setSize()
    // _viewer?.eventManager.objectSelected.next(cube);
    useAmbientLight(_viewer)
    // useDraw(_viewer)

    // useEnvironment(_viewer)

    // usePostProcessingManagerTest(_viewer);
    // useSearchTest(_viewer)
    // useMeasureTest(_viewer)
    setViewer(_viewer)
    bus.viewerInitSubject.next(true);

  }, 1000)
  window.viewer = _viewer;

  // const asset = new GltfModelAsset({
  //   // loadUrl: "/Rampaging T-Rex.glb",
  //   loadUrl: "/testModel/大场景_WEBGL.glb",
  //   // url: "/aaa.glb",
  // })
  // _viewer.assetManager.loadGltf(asset).then((model) => {
  //   console.log(model)
  //   _viewer.editor.addObjectExecute(model);
  // })

})
const bus = useBus();

const setViewer = useSetViewer();


const onDrop = (event: DragEvent) => {
  console.log("onDrop", event)
  console.log("拖动", event)
  if (!event.dataTransfer) return
  const data = event.dataTransfer.getData('data');
  const info = JSON.parse(data) as IDragInfo;



}


</script>

<template>
  <div class="container" ref="canvasContainer" @drop="onDrop">
    <control/>
    <side-pane/>
    <statistical/>
  </div>
</template>

<style scoped>

</style>