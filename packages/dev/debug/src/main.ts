import {MeshBuilder, MeshDebugPluginMaterial, Viewer,MeshDebugMode, StandardMaterial,Color3} from "@plum-render/three-sdk";

let viewer = await Viewer.create("app", {
    // packagePath: "",
    // appName: "12"
});
let scene = viewer.scene;

viewer.initSubject.subscribe(() => {
    console.log("场景初始化完成");
})

let box = MeshBuilder.CreateBox('box', {width: 2, height: 2, depth: 2}, scene);
console.log(box)
const boxMaterial = new StandardMaterial("boxMaterial", scene);
boxMaterial.diffuseColor = new Color3(1, 0, 0); // 红色
box.material = boxMaterial;
console.log(MeshDebugPluginMaterial)
MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(box);
console.log(scene.meshes.length)

let ccc  = box



window.aaa = () => {
    console.log("scene.meshes",scene.meshes.length)
    viewer.scene.removeMesh(box)
    console.log("scene.meshes11",scene.meshes.length)
    console.log(viewer.scene)
}

console.log(ccc)