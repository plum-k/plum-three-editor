import *  as THREE from "three";

export type ObjectMap = {
    nodes: { [name: string]: Object3D }
    materials: { [name: string]: Material }
}

export function buildGraph(object: Object3D) {
    const data: ObjectMap = {nodes: {}, materials: {}}
    if (object) {
        object.traverse((obj: any) => {
            if (obj.name) data.nodes[obj.name] = obj
            if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material
        })
    }
    return data
}
