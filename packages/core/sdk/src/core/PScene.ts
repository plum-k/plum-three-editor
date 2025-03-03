import {Object3D, Scene} from "three";
import {get} from "lodash-es";

export const isPScene = (value: unknown): value is PScene => {
    return get(value, 'isPScene') === true;
}

export class PScene extends Scene {

    constructor() {
        super();
    }

    add(...object: Object3D[]): this {
        // todo
        if (this.name ==="sceneHelpers"){
        }else {
            console.log(new Error('添加物体').stack)
        }
        return super.add(...object);
    }
}