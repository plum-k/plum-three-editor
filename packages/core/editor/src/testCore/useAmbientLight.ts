import * as THREE from "three";
import {Viewer} from "@plum-render/three-sdk";

const useAmbientLight =
    (viewer: Viewer) => {
        let a = new THREE.AmbientLight(0xffffff, 0.5)
        viewer.scene.add(a);
        // viewer?.eventManager.objectSelected.next(a);
    }
export {
    useAmbientLight
}