import {LineMaterialType, LineType, PathMesh, PathTubeMesh, Viewer} from "@plum-render/three-sdk";
import {Vector3} from "three"
import {Pane} from "tweakpane";

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

const pane = new Pane({
    container: _viewer.container
});

const PARAMS = {

}

pane.element.style.position = "absolute";
pane.element.style.right = "0";
pane.element.style.top = "0";

pane.addButton({
    title: '进度动画',
}).on('click', () => {
    pathTubeMesh.startTick(_viewer);
    pathTubeMesh.playProgressAnimation = true;
})
