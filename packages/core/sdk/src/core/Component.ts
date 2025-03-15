import {Viewer} from "./Viewer";
import {deepMergeRetain} from "../tool";

export interface IComponentOptions {
    viewer: Viewer;
}

export class Component<T extends IComponentOptions = IComponentOptions> {
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

    get cameraManager() {
        return this.viewer.cameraManager;
    }
    get cameraControls() {
        return this.viewer.cameraManager.cameraControls;
    }
    get renderer() {
        return this.viewer.renderManager.defaultWebGLRenderer;
    }
    get renderManager() {
        return this.viewer.renderManager;
    }
    get postProcessingComponent() {
        return this.viewer.postProcessingComponent;
    }
    get assetManager() {
        return this.viewer.assetManager;
    }

    get camera() {
        return this.viewer.cameraManager.camera;
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