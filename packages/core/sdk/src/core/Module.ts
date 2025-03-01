import {Viewer} from "./Viewer";
import {deepMergeRetain} from "../tool";

export interface IModuleOptions {
    viewer: Viewer;
}

export class Module<T extends IModuleOptions = IModuleOptions> {
    options: Required<T>;
    viewer: Viewer;

    constructor(options: T) {
        this.options = deepMergeRetain(options, {});
        this.viewer = this.options.viewer;
    }

    get scene() {
        return this.viewer.scene;
    }

    get sceneHelpers() {
        return this.viewer.sceneHelpers;
    }

    get eventManager() {
        return this.viewer.eventManager
    }

    get threeCameraControls() {
        return this.viewer.threeCameraControls;
    }

    get renderManager() {
        return this.viewer.renderManager;
    }

    get assetManager() {
        return this.viewer.assetManager;
    }

    get camera() {
        return this.viewer.threeCameraControls.camera;
    }

    get container() {
        return this.viewer.container;
    }

    get canvas() {
        return this.renderManager.defaultWebGLRenderer.domElement;
    }

    get editor() {
        return this.viewer.editor;
    }

    get loop() {
        return this.viewer.loop;
    }

    get cssRenderer() {
        return this.viewer.cssRenderer;
    }
}