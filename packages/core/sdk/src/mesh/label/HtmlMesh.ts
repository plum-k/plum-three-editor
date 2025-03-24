import {Object3D} from "three";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {CSS3DObject, CSS3DSprite} from "three/examples/jsm/renderers/CSS3DRenderer";
import {deepMergeRetain} from "../../tool";

export enum HtmlMeshType {
    CSS2DObject,
    CSS3DObject,
    CSS3DSprite
}

export interface IHtmlMeshOptions {
    type?: HtmlMeshType;
    element: HTMLElement;
}

export class HtmlMesh extends Object3D {
    options: IHtmlMeshOptions;
    object!: CSS2DObject | CSS3DObject | CSS3DSprite
    isHtmlMesh: boolean = true;

    constructor(_options: IHtmlMeshOptions) {
        super();
        this.options = deepMergeRetain(_options, {
            type: HtmlMeshType.CSS3DObject
        });
        const {type, element} = this.options;
        switch (type) {
            case HtmlMeshType.CSS2DObject:
                this.object = new CSS2DObject(element);
                break;
            case HtmlMeshType.CSS3DObject:
                this.object = new CSS3DObject(element);
                break;
            case HtmlMeshType.CSS3DSprite:
                this.object = new CSS3DSprite(element);
                break
        }
        this.add(this.object)
    }
}









