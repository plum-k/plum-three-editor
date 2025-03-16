import * as THREE from 'three';
import {
    BlendFunction,
    BloomEffect,
    BloomEffectOptions,
    EdgeDetectionMode,
    Effect,
    EffectComposer,
    EffectPass,
    FXAAEffect,
    GridEffect, KawaseBlurPass,
    OutlineEffect,
    PixelationEffect,
    PredicationMode,
    RenderPass,
    SelectiveBloomEffect,
    SMAAEffect,
    SMAAPreset,
    SSAOEffect,
} from "postprocessing";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    // antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app')!.appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

// 创建一个简单的几何体
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

const a = new THREE.Group();
a.add(cube);
scene.add(a);

camera.position.z = 5;

// 设置后处理
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const  selectiveBloomEffect = new SelectiveBloomEffect(scene, camera, {
    blendFunction: BlendFunction.ADD,
    mipmapBlur: false   ,
    luminanceThreshold: 0,
    luminanceSmoothing: 0.2,
    intensity: 5,
    radius: 0.34
});
const outlinePass = new EffectPass(camera, selectiveBloomEffect);
composer.addPass(outlinePass);
selectiveBloomEffect.selection.add(cube);
function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    composer.render();
}

animate();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    composer.setSize(width, height);
});