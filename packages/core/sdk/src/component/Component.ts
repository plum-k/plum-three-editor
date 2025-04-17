import {Viewer} from "../core/Viewer";
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
        return this.viewer.eventComponent
    }

    get cameraManager() {
        return this.viewer.cameraComponent;
    }

    get cameraControls() {
        return this.viewer.cameraComponent.cameraControls;
    }

    get renderer() {
        return this.viewer.renderComponent.defaultWebGLRenderer;
    }

    get renderManager() {
        return this.viewer.renderComponent;
    }

    get postProcessingComponent() {
        return this.viewer.postProcessingComponent;
    }

    get assetManager() {
        return this.viewer.assetComponent;
    }

    get camera() {
        return this.viewer.cameraComponent.camera;
    }

    get container() {
        return this.viewer.container;
    }

    get canvas() {
        return this.renderManager.renderer.domElement;
    }

    get editor() {
        return this.viewer.editor;
    }

    get loop() {
        return this.viewer.loop;
    }

    get cssRendererComponent() {
        return this.viewer.cssRendererComponent;
    }
}