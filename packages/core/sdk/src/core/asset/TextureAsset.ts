import Asset, {IAsset} from "./Asset";
import {Texture} from "three";
import {isNil} from "lodash-es";
import {extractFileNameAndExtension} from "../../tool";

export interface ITextureAsset extends IAsset {

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
export default class TextureAsset extends Asset<Texture> {
    constructor(options: ITextureAsset) {
        super(options)
    }

    parseFile() {
        if (!isNil(this.options.file)) {
            this.file = this.options.file
            this.fileReader = new FileReader();
            let [fileName, fileExtension] = extractFileNameAndExtension(this.file);
            this.name = fileName
            this.extension = fileExtension

            this.url = URL.createObjectURL(this.file);
        }
    }

}
