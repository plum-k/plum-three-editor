<script lang="ts" setup>
import {ElFormItem} from "element-plus";
import {onMounted, ref} from "vue";
import {useBus} from "../../hooks";
import * as THREE from "three";
import {WebGLRenderer} from "three";
import {get, isArray} from "lodash-es";
import {isCompressedTexture, isDataTexture} from "three-is";
import {FullScreenQuad} from "three-stdlib";

interface Props {
  name: string;
  label: string;
}

const props = defineProps<Props>();
const {name, label} = props

const bus = useBus();
// const change = (value: boolean) => {
//
//   objectAttributeChangeSubject.next({
//     name: name,
//     value: value
//   });
// }

const canvasRef = ref<HTMLCanvasElement>()

let renderer: WebGLRenderer
let fsQuad: FullScreenQuad<THREE.MeshBasicMaterial>;

function renderToCanvas(texture: THREE.Texture) {
  if (renderer === undefined) {
    renderer = new THREE.WebGLRenderer();
  }
  if (fsQuad === undefined) {
    fsQuad = new FullScreenQuad(new THREE.MeshBasicMaterial());
  }
  const image = texture.image;
  renderer.setSize(image.width, image.height, false);
  fsQuad.material.map = texture;
  fsQuad.render(renderer);
  return renderer.domElement;
}

onMounted(() => {
  const object = bus.selectObject as THREE.Mesh;
  const _material = object.material;
  const material = isArray(_material) ? _material[0] : _material

  const texture = get(material, name) as THREE.Texture;

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
    } else {
      canvas.title = 'empty';
    }
  }
})

</script>

<template>
  <el-form-item :label="label" size="small">
    <canvas ref="canvasRef">
    </canvas>
  </el-form-item>
</template>

<style scoped>

</style>