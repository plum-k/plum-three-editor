import * as THREE from "three";
import {Viewer} from @plum-render/three-sdk";

const useLightTest = (viewer: Viewer) => {

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    viewer.editor.addObject(directionalLight);

}

export default useLightTest;