<script lang="ts" setup>
import {ElFormItem} from "element-plus";
import {inject, onMounted, ref, type ShallowRef, watch} from "vue";
import {type IAttributeProps, type IObjectAttributeChange, useAttributeInject, useBus} from "../../hooks";
import { MeshBasicMaterial, Texture, WebGLRenderer,Mesh} from "three";
import {get, isArray} from "lodash-es";
import {isCompressedTexture, isDataTexture} from "three-is";
import {FullScreenQuad} from "three-stdlib";
import {Asset} from "@plum-render/three-sdk";
import {ElCheckbox} from "element-plus";

import type {Subject} from "rxjs";

interface Props extends IAttributeProps {
  getTexture?: () => Texture | null;
}

const props = defineProps<Props>();
const {name, label,getTexture} = props
const bus = useBus();

const input = document.createElement('input');
input.type = 'file';
input.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  loadFile(target?.files![0] as File);
});

const click = () => {
  input.click();
}
const objectAttributeChangeSubject = inject<Subject<IObjectAttributeChange>>("objectAttributeChangeSubject")!;

const getObject = inject<() => object>("getObject")!;
const updateTrigger = inject<ShallowRef<boolean>>("updateTrigger")!;

watch(updateTrigger, () => {
  // console.log("updateTrigger", updateTrigger.value)
})

function loadFile(file: File) {
  // const extension = file.name.split('.').pop().toLowerCase();
  // const reader = new FileReader();
  //
  // const hash = `${file.lastModified}_${file.size}_${file.name}`;
  const asset = new Asset({
    file: file,
  })
  bus.viewer?.assetManager.loadAsset(asset).then(value => {
    objectAttributeChangeSubject.next({
      name: name,
      value: value
    });
    renderTexture(value as Texture)
  })
}

const canvasRef = ref<HTMLCanvasElement>()

let renderer: WebGLRenderer
let fsQuad: FullScreenQuad<MeshBasicMaterial>;

function renderToCanvas(texture: Texture) {
  if (renderer === undefined) {
    renderer = new WebGLRenderer();
  }
  if (fsQuad === undefined) {
    fsQuad = new FullScreenQuad(new MeshBasicMaterial());
  }
  const image = texture.image;
  renderer.setSize(image.width, image.height, false);
  fsQuad.material.map = texture;
  fsQuad.render(renderer);
  return renderer.domElement;
}

onMounted(() => {
  renderTexture();
})

const renderTexture = (inTexture?: Texture) => {
  let texture: Texture | null = null;

  if (getTexture) {
    texture = getTexture();
  } else {
    const object = bus.selectObject as Mesh;
    const _material = object.material;
    const material = isArray(_material) ? _material[0] : _material
    texture = get(material, name) as Texture;
  }
  if (inTexture) {
    texture = inTexture;
  }
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.width = 32;
    canvas.height = 16;
    canvas.style.cursor = 'pointer';
    canvas.style.marginRight = '5px';
    canvas.style.border = '1px solid #888';
    const context = canvas.getContext('2d')!;
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (texture !== null) {
      const image = texture.image;
      if (image !== undefined && image !== null && image.width > 0) {
        const scale = canvas.width / image.width;
        if (isDataTexture(texture) || isCompressedTexture(texture)) {
          const canvas2 = renderToCanvas(texture);
          context.drawImage(canvas2, 0, 0, image.width * scale, image.height * scale);
        } else {
          context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
        }
      } else {
      }
      checked.value = true;
    } else {
      canvas.title = 'empty';
      checked.value = false;
    }
  }
}
const checked = ref(false)
</script>

<template>
  <el-form-item :label="label" size="small">
    <el-checkbox v-model="checked" class="!mr-1.5" />
    <canvas ref="canvasRef" @click="click"/>
  </el-form-item>
</template>

<style scoped>

</style>