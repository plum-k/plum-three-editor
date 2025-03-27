import {Viewer} from "../../core";
import {Texture} from "three";
import {Path} from "../../mesh";
import {defaults} from "lodash-es";

export interface IProgressAnimation {
    viewer: Viewer;
    texture: Texture;
    path: Path;
    speed: number;
}


export function progressAnimation(option: IProgressAnimation) {
    const {viewer,path, texture, speed} = defaults({
        speed: 0.01
    }, option);
    const distance = path.pathPointList.distance();
    const subscription = viewer.eventManager.renderSubject.subscribe(function (event) {
        if (distance > 0) {
            params.progress += params.playSpeed / distance;
            if (params.progress > 1) {
                playing = false;
                params.progress = 1;
            }
        } else {
            playing = false;
            params.progress = 1;
        }
    });




}