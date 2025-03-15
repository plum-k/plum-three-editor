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

const outlineEffect =  new OutlineEffect(scene, camera, {
    blendFunction: BlendFunction.SCREEN,
    multisampling: Math.min(4, renderer.capabilities.maxSamples),
    edgeStrength: 2.5,
    pulseSpeed: 0.0,
    visibleEdgeColor: 0xffffff,
    hiddenEdgeColor: 0x22090a,
    height: 480,
    blur: false,
    xRay: true,
});
const outlinePass = new EffectPass(camera, outlineEffect);
composer.addPass(outlinePass);
outlineEffect.selection.add(cube);
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