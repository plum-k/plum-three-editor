import {Viewer} from "@plum-render/three-sdk";
import {Subject} from "rxjs";

export class Bus {

    constructor() {
    }

    viewer: Viewer | null = null;
    viewerInitSubject = new Subject<boolean>();


    setViewer(value: Viewer) {
        this.viewer = value;
    }
}



