import Asset, {IAsset} from "./Asset";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export interface IGltfModelAsset extends IAsset {

}

/**
 *
 * ```ts
 * asset.loadSubject.subscribe({
 *     next: (gltf) => {
 *         console.log(gltf.scene)
 *     },
 *     error: (error) => {
 *         console.log(error)
 *     }
 * })
 *
 * asset.progressSubject.subscribe({
 *     next: (progress) => {
 *         console.log(progress+"%")
 *     },
 *     error: (error) => {
 *         console.log(error)
 *     }
 * })
 * ```
 */
export default class GltfModelAsset extends Asset<GLTF> {
    constructor(options: IGltfModelAsset) {
        super(options)
    }
}
