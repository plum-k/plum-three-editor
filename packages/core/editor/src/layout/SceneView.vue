<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ESceneLoadType, ESceneSaveType, Viewer} from "@plum-render/three-sdk";
import {useRoute} from "vue-router";
import * as THREE from "three";
import {BoxGeometry, Mesh, MeshStandardMaterial} from "three";
import {useBus,} from "../hooks";
import {Control} from "./sceneView";
import type {IDragInfo} from "../interface/IDragInfo.ts";
import CameraInfo from "./sceneView/CameraInfo.vue";
import {type Id, toast} from "vue3-toastify";
import ViewTool from "./sceneView/ViewTool.vue";
import SceneStatistics from "./sceneView/SceneStatistics.vue";
import {uniqueId} from "lodash-es";

const canvasContainer = ref<HTMLDivElement>();

const bus = useBus();
const route = useRoute();
const appId = route.params.appId as string;
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
const loadIdMao = new Map<string, Id>();
const saveIdMao = new Map<string, Id>();

onMounted(() => {
  if (!canvasContainer.value) return
  let _viewer!: Viewer
  _viewer = new Viewer(canvasContainer.value, {
    appId: appId,
    packageType: "chunk",
    isCreateDefaultLight: true,
    isCubeGizmo: true,
    isSphereGizmo: true,
    ossApiOptions: {
      server: import.meta.env.VITE_SERVER,
      bucket: import.meta.env.VITE_BUCKET,
      region: import.meta.env.VITE_REGION,
    }
  });
  _viewer.initSubject.subscribe(() => {
    bus.setViewer(_viewer)
    bus.viewerInitSubject.next(true);
  })
  // 场景加载进度条
  _viewer.sceneLoadProgressSubject.subscribe((event) => {
    const {type, name, total, loaded} = event;
    const _progress = loaded / total;
    const id = loadIdMao.get(name);
    if (id === undefined) {
      if (type === ESceneLoadType.Load) {
        const newId = toast.loading(name, {
          position: toast.POSITION.BOTTOM_CENTER,
          // containerId: 'toastContainer',
        });
        loadIdMao.set(name, newId);
      } else {
        if (total === loaded) {
          return
        }
        const newId = toast.loading(name, {
          position: toast.POSITION.BOTTOM_CENTER,
          // containerId: 'toastContainer',
        });
        loadIdMao.set(name, newId);
      }
    } else {
      if (type === ESceneLoadType.Load) {
        toast.update(id, {render: "场景加载成功", type: "success", isLoading: false, autoClose: 3000});
        loadIdMao.clear()
      } else {
        if (loaded === total) {
          window.setTimeout(() => {
            toast.remove(id);
          }, 100)
        } else {
          toast.update(id, {render: name, progress: _progress, autoClose: 3000});
        }
      }
    }
  })
  _viewer.sceneSaveProgressSubject.subscribe((event) => {
    const {type, name, total, loaded} = event;
    const _progress = loaded / total;
    const id = saveIdMao.get(name);
    console.log(event)
    if (id === undefined) {
      if (type === ESceneSaveType.Save) {
        const newId = toast.loading(name, {
          position: toast.POSITION.BOTTOM_CENTER,
          // containerId: 'toastContainer',
        });
        saveIdMao.set(name, newId);
      } else {
        if (total === loaded) {
          return
        }
        const newId = toast.loading(name, {
          position: toast.POSITION.BOTTOM_CENTER,
          // containerId: 'toastContainer',
        });
        saveIdMao.set(name, newId);
      }
    } else {
      if (type === ESceneSaveType.Save) {
        toast.update(id, {render: "场景保存成功", type: "success", isLoading: false, autoClose: 3000});
        saveIdMao.clear()
      } else {
        if (loaded === total) {
          window.setTimeout(() => {
            toast.remove(id);
          }, 100)
        } else {
          toast.update(id, {render: name, progress: _progress, autoClose: 3000});
        }
      }
    }
  })
  _viewer.assetManager.startSubject.subscribe((value) => {
    // setPercent(value.loaded / value.total)
  })
  _viewer.assetManager.progressSubject.subscribe((value) => {
    // todo
    // setPercent(value.loaded / value.total)
    //
    if (value.loaded === value.total) {

    }
  })

  // useLightTest(_viewer)

  _viewer.cameraManager.cameraControls.setPosition(5, 5, 5);
  _viewer.cameraManager.cameraControls.setTarget(0, 0, 0);


  setTimeout(() => {
    _viewer.setSize()
    // _viewer?.eventManager.objectSelected.next(cube);
    // useAmbientLight(_viewer)
    // useDraw(_viewer)

    // useEnvironment(_viewer)

    // usePostProcessingManagerTest(_viewer);
    // useSearchTest(_viewer)
    // useMeasureTest(_viewer)
    // bus.viewerInitSubject.next(true);

  }, 1000)
  window.viewer = _viewer;
  // addBox(_viewer, 1);

  // const asset = new GltfModelAsset({
  //   // loadUrl: "/Rampaging el-Rex.glb",
  //   loadUrl: "/A319.glb",
  //   // url: "/aaa.glb",
  // })
  // _viewer.assetManager.loadGltf(asset).then((model) => {
  //   _viewer.editor.addObjectExecute(model);
  // })
})


const onDrop = (event: DragEvent) => {

  if (!event.dataTransfer) return
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const viewer = bus.viewer;
    viewer?.assetManager.dragHandler(event)
  } else {
    const data = event!.dataTransfer!.getData('data');
    if (data === "") return;
    const info = JSON.parse(data) as IDragInfo;
    if (info) {
      panelDrop(info)
    }
  }
}

/**
 * 从面板拖动到容器
 */
const panelDrop = (info: IDragInfo) => {
  const viewer = bus.viewer;
  const scene = viewer?.scene!;

  const mesh = createMesh(info);
  if (mesh) {
    // todo 历史记录
    scene.add(mesh);
    viewer?.editor.editorEventManager.sceneGraphChanged.next(true);
  } else {
    const light = createLight(info);
    if (light) {
      scene.add(light);
      viewer?.editor.editorEventManager.sceneGraphChanged.next(true);
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
  mesh.name = `${uniqueId(info.type)}`;
  mesh.geometry.name = mesh.name
  return mesh;
}

function createLight(info: IDragInfo) {
  let light: THREE.Light | null = null;
  switch (info.type) {
    case 'AmbientLight':
      light = new THREE.AmbientLight(0x222222);
      break;
    case 'DirectionalLight':
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 10, 7.5);
      break;
    case 'HemisphereLight':
      light = new THREE.HemisphereLight(0x00aaff, 0xffaa00, 1);
      light.position.set(0, 10, 0);
      break;
    case 'PointLight':
      light = new THREE.PointLight(0xffffff, 1);
      break;
    case 'SpotLight':
      light = new THREE.SpotLight(0xffffff, 1);
      light.position.set(5, 10, 7.5);
      break;
    default:
      console.warn(`Unknown light type: ${info.type}`);
      return null;
  }
  light.name = `${uniqueId(info.type)}`;
  return light;
}

</script>

<template>
  <div class="h-full w-full relative flex flex-col">
    <view-tool/>
    <div id="canvasContainer" ref="canvasContainer" class="container w-full relative h-[calc(100%-62px)]"
         @drop="onDrop">
      <control/>
      <scene-statistics/>
    </div>
    <camera-info/>
  </div>
</template>

<style scoped>

</style>

