import {Asset, IAsset} from "./Asset";
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
export class TextureAsset extends Asset<Texture> {
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
