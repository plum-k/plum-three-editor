import {Viewer} from "../../core";
import {Texture} from "three";
import {defaults} from "lodash-es";

export interface IUvAnimation {
    viewer: Viewer;
    texture: Texture;
    speed: number;
}

/**
 * uv动画 工具
 * @param option
 */
export function uvAnimation(option: IUvAnimation) {
    const {viewer, texture, speed} = defaults({
        speed: 0.01
    }, option);

    const subscription = viewer.eventManager.renderSubject.subscribe(function (event) {
        if (texture) {
            texture.offset.x += speed;
            texture.repeat.x = 1;
        }
    });
    const stop = () => {
        subscription.unsubscribe();
    }

    return [subscription];
}