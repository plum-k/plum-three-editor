<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {Viewer} from "@plum-render/three-sdk";
import {useRoute} from "vue-router";
import {useAmbientLight} from "../testCore/useAmbientLight.ts";
import * as THREE from "three";
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

  const viewer = bus.viewer;
  const scene = viewer?.scene!;

  const mesh = createMesh(info);
  if (mesh) {
    // todo 历史记录
    scene.add(mesh);

    viewer?.editor.editorEventManager.sceneGraphChanged.next(null);

  } else {
    const light = createLight(info);
    if (light) {
      scene.add(light);
      viewer?.editor.editorEventManager.sceneGraphChanged.next(null);
    } else {
      console.warn(`Unknown type: ${info.type}`);
    }
  }
}

function createMesh(info: IDragInfo) {
  let geometry: THREE.BufferGeometry | null = null;
  switch (info.type) {
    case 'BoxGeometry':
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'CapsuleGeometry':
      geometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
      break;
    case 'CircleGeometry':
      geometry = new THREE.CircleGeometry(1, 32);
      break;
    case 'CylinderGeometry':
      geometry = new THREE.CylinderGeometry(1, 1, 1, 32);
      break;
    case 'DodecahedronGeometry':
      geometry = new THREE.DodecahedronGeometry(1);
      break;
    case 'IcosahedronGeometry':
      geometry = new THREE.IcosahedronGeometry(1);
      break;
    case 'LatheGeometry':
      geometry = new THREE.LatheGeometry();
      break;
    case 'OctahedronGeometry':
      geometry = new THREE.OctahedronGeometry(1);
      break;
    case 'PlaneGeometry':
      geometry = new THREE.PlaneGeometry(1, 1);
      break;
    case 'RingGeometry':
      geometry = new THREE.RingGeometry(0.5, 1, 32);
      break;
    case 'SphereGeometry':
      geometry = new THREE.SphereGeometry(1, 32, 16);
      break;
    case 'TetrahedronGeometry':
      geometry = new THREE.TetrahedronGeometry(1);
      break;
    case 'TorusGeometry':
      geometry = new THREE.TorusGeometry(1, 0.4, 12, 48);
      break;
    case 'TorusKnotGeometry':
      geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8);
      break;
    case 'TubeGeometry':
      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(2, -2, -0.67),
        new THREE.Vector3(-2, -2, 0.67),
        new THREE.Vector3(-2, 2, 2)
      ]);
      geometry = new THREE.TubeGeometry(path, 64, 1, 8);
      break;
    default:
      console.warn(`Unknown mesh type: ${info.type}`);
      return null;
  }
  if (!geometry) return null;
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

  return mesh;
}

function createLight(info: IDragInfo) {
  let light: THREE.Light | null = null;
  switch (info.type) {
    case 'AmbientLight':
      light = new THREE.AmbientLight(0x222222);
      light.name = 'AmbientLight';
      break;
    case 'DirectionalLight':
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.name = 'DirectionalLight';
      light.position.set(5, 10, 7.5);
      break;
    case 'HemisphereLight':
      light = new THREE.HemisphereLight(0x00aaff, 0xffaa00, 1);
      light.name = 'HemisphereLight';
      light.position.set(0, 10, 0);
      break;
    case 'PointLight':
      light = new THREE.PointLight(0xffffff, 1);
      light.name = 'PointLight';
      break;
    case 'SpotLight':
      light = new THREE.SpotLight(0xffffff, 1);
      light.name = 'SpotLight';
      light.position.set(5, 10, 7.5);
      break;
    default:
      console.warn(`Unknown light type: ${info.type}`);
      return null;
  }
  return light;
}

</script>

<template>
  <div ref="canvasContainer" class="container" @drop="onDrop">
    <control/>
    <side-pane/>
    <statistical/>
  </div>
</template>

<style scoped>

</style>