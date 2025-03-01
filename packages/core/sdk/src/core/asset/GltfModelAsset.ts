import {Asset, IAsset} from "./Asset";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export interface IGltfModelAsset extends IAsset {

}

/**
 *
 * ```ts
 * asset.loadSubject.subscribe({
 *     next: (gltf) => {
 *         
 *     },
 *     error: (error) => {
 *         
 *     }
 * })
 *
 * asset.progressSubject.subscribe({
 *     next: (progress) => {
 *         
 *     },
 *     error: (error) => {
 *         
 *     }
 * })
 * ```
 */
export class GltfModelAsset extends Asset<GLTF> {
    constructor(options: IGltfModelAsset) {
        super(options)
    }
}
