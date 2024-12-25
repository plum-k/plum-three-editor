import * as THREE from "three";
import {SpriteMaterial} from "three/src/materials/Materials";

import html2canvas from "html2canvas";

export interface ISpriteOptions {
    material?: SpriteMaterial
    element?: HTMLElement;

}

export default class Sprite extends THREE.Sprite {
    options: Required<ISpriteOptions>;

    constructor(_options: ISpriteOptions) {

        super(_options.material);
        this.options = deepMergeRetain(_options, {});

        // const map = new THREE.TextureLoader().load("sprite.png");
        // const material = new THREE.SpriteMaterial({map: map});
        html2canvas(this.options.element).then(canvas => {
            console.log(canvas)
        })
    }
}









