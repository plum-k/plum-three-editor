import {Intersection, Object3D, Object3DEventMap, Vector3} from "three";

export interface IPickInfo {
    intersects: Intersection<Object3D<Object3DEventMap>>[];
    position: Vector3
}