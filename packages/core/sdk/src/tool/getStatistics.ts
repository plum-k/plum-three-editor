import * as THREE from "three";
import {isMesh, isPoints} from "three-is";

/**
 * 获取场景统计信息
 * @param scene
 */
export function getStatistics(scene: THREE.Object3D) {
    let objects = 0, vertices = 0, triangles = 0;
    for (let i = 0, l = scene.children.length; i < l; i++) {
        const object = scene.children[i];
        object.traverseVisible((object) => {
            objects++;
            if (isMesh(object) || isPoints(object)) {
                const geometry = object.geometry;
                vertices += geometry.attributes.position.count;
                if (isMesh(object)) {
                    if (geometry.index !== null) {
                        triangles += geometry.index.count / 3;
                    } else {
                        triangles += geometry.attributes.position.count / 3;
                    }
                }
            }
        });
    }
    return {
        objects,
        vertices,
        triangles
    }
}