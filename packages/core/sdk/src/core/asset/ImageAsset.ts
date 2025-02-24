import {Asset, IAsset} from "./Asset";

export interface IImageAsset extends IAsset {

}

export class ImageAsset extends Asset {
    constructor(options: IImageAsset) {
        super(options)
    }
}