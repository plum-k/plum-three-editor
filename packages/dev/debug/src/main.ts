import {PathMesh, PathTubeMesh, Viewer} from "@plum-render/three-sdk";
import {Vector3} from "three"

const _viewer = new Viewer(document.getElementById('app'), {
    isCreateDefaultLight: true,
    isCreateDefaultEnvironment: true
})

const points = [
    new Vector3(-5, 0, 5),
    new Vector3(-5, 0, -5),
    new Vector3(5, 0, -5),
    new Vector3(5, 0, 5)
];

const pathTubeMesh = new PathMesh({
    pathPointListParams: {
        points: points,
        up: new Vector3(0, 1, 0),
        close: true
    }
});

_viewer.scene.add(pathTubeMesh)
