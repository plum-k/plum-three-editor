import {Sprite as THREESprite, SpriteMaterial} from "three";

import html2canvas from "html2canvas";
import {deepMergeRetain} from "../tool";

export interface ISpriteOptions {
    material?: SpriteMaterial
    element?: HTMLElement;

}

export class Sprite extends THREESprite {
    options: Required<ISpriteOptions>;

    constructor(_options: ISpriteOptions) {

        super(_options.material);
        this.options = deepMergeRetain(_options, {});

        // const map = new TextureLoader().load("sprite.png");
        // const material = new SpriteMaterial({map: map});
        html2canvas(this.options.element).then(canvas => {

        })
    }
}









