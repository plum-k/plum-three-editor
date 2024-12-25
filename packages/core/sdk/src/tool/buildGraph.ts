import *  as THREE from "three";

export type ObjectMap = {
    nodes: { [name: string]: THREE.Object3D }
    materials: { [name: string]: THREE.Material }
}

export function buildGraph(object: THREE.Object3D) {
    const data: ObjectMap = {nodes: {}, materials: {}}
    if (object) {
        object.traverse((obj: any) => {
            if (obj.name) data.nodes[obj.name] = obj
            if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material
        })
    }
    return data
}
