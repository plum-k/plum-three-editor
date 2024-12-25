import Asset, {IAsset} from "./Asset";

export interface IImageAsset extends IAsset {

}

export default class ImageAsset extends Asset {
    constructor(options: IImageAsset) {
        super(options)
    }
}