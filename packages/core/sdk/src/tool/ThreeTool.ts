import * as THREE from "three";
import {isDataTexture, isVector3} from "three-is";
import {Object3D} from "three/src/core/Object3D";
import {ESearchMode, ICondition, normalize, Search} from "@plum-render/tool";

export type Vector3Array = Array<THREE.Vector3>
export type Num3Array = Array<[number, number, number]>
export type V3Array = Num3Array | Vector3Array

export default class ThreeTool {

    static getObjectMaterial(object: THREE.Mesh, slot?: number): THREE.Material {
        let material = object.material;
        if (Array.isArray(material) && slot !== undefined) {
            material = material[slot];
        }
        return material as THREE.Material;
    }

    static setObjectMaterial(object: THREE.Mesh, slot: number, newMaterial: THREE.Material) {
        if (Array.isArray(object.material) && slot !== undefined) {
            object.material[slot] = newMaterial;
        } else {
            object.material = newMaterial;
        }
    }

    static search(obj: Object3D, array: Array<ICondition>, searchMode: ESearchMode = ESearchMode.MatchAll) {
        const search = new Search(array, searchMode);
        let result: Array<Object3D> = [];
        obj.traverse((target) => {
            const isMatch = search.matching(target);
            if (isMatch) {
                result.push(target);
            }
        })
        return result;
    }

    static calculateCenter(pointA: THREE.Vector3, pointB: THREE.Vector3) {
        const centerPoint = new THREE.Vector3()
            .addVectors(pointA, pointB)
            .multiplyScalar(0.5);
        return centerPoint;
    }

    static calculateTotalLength(points: Array<THREE.Vector3>) {
        let totalLength = 0;

        for (let i = 0; i < points.length - 1; i++) {
            const pointA = points[i];
            const pointB = points[i + 1];

            // 计算两点之间的距离
            totalLength += pointA.distanceTo(pointB);
        }

        return totalLength;
    }

    static v3ArrayToVector3Array(array: V3Array): Array<THREE.Vector3> {
        if (array.length === 0) {
            return array as Vector3Array
        }
        if (isVector3(array[0])) {
            return array as Vector3Array
        } else {
            return (array as Num3Array).map(v => {
                return new THREE.Vector3(v[0], v[1], v[2])
            })
        }
    }

    static v3ArrayToNum3Array(array: V3Array): Num3Array {
        if (array.length === 0) {
            return array as Num3Array
        }
        if (!isVector3(array[0])) {
            return array as Num3Array
        } else {
            return (array as Vector3Array).map(v => {
                return v.toArray();
            })
        }
    }

    static getQuadraticBezierCurve3Points(array: V3Array) {
        return {
            vector3Array: ThreeTool.v3ArrayToVector3Array(array),
            num3Array: ThreeTool.v3ArrayToNum3Array(array)
        }
    }

    static getBox3ByV3Array(array: V3Array) {
        const v3Array = ThreeTool.v3ArrayToVector3Array(array);
        return new THREE.Box3().setFromPoints(v3Array);
    }

    static getBase64FromTexture(texture: THREE.Texture) {
        if (isDataTexture(texture)) {
            return undefined;
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = texture.image;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx!.drawImage(img, 0, 0);
            return canvas.toDataURL('image/jpeg');
        }
    }

    // 从base64字符串创建Texture
    static getTextureFromBase64(base64: string) {
        const texture = new THREE.Texture();
        const image = new Image();
        image.src = base64;
        image.onload = () => {
            texture.image = image;
            texture.needsUpdate = true;
        };
        return texture;
    }

    static getObjectByUuid(object: THREE.Object3D, uuid: string) {
        return object.getObjectByProperty('uuid', uuid);
    }

    // 获取鼠标在容器中的 位置的 比值 0-1
    static getMousePosition(event: MouseEvent, dom: HTMLElement) {
        const rect = dom.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    }

    // 归一化设备坐标
    static getNFC(event: MouseEvent, dom: HTMLElement) {
        let [x, y] = ThreeTool.getMousePosition(event, dom)
        x = normalize(x, 0, 1, -1, 1)
        y = normalize(y, 0, 1, -1, 1);
        return [x, -y];
    }
}