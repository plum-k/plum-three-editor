import {SRGBColorSpace, WebGLRenderer} from "three";
import {Component, IComponentOptions} from "../core/Component";
import {IResourceManagers} from "./AssetManager";

export interface IRenderManagerOptions extends IComponentOptions {
}

export class RenderManager extends Component {
    defaultWebGLRenderer: WebGLRenderer;

    constructor(options: IResourceManagers) {
        super(options);
        this.defaultWebGLRenderer = this.createWebGLRenderer();
    }

    setSize(width: number, height: number, updateStyle?: boolean) {
        this.defaultWebGLRenderer.setSize(width, height, updateStyle);
    }

    createWebGLRenderer() {
// 创建WebGL渲染器实例，用于高性能的图形渲染
// @param {Object} options - 渲染器的配置选项
// @param {string} options.powerPreference - 指定GPU的性能偏好，'high-performance' 表示优先考虑性能
// @param {boolean} options.antialias - 是否启用抗锯齿，用于提高图形边缘的平滑度
// @param {boolean} options.alpha - 是否启用alpha通道，用于支持透明度

        const webGLRenderer = new WebGLRenderer({
            // powerPreference: 'high-performance',
            // antialias: true,
            // alpha: true

            powerPreference: "high-performance",
            antialias: true,
            stencil: false,
            depth: true
        })
        webGLRenderer.outputColorSpace = SRGBColorSpace;
        webGLRenderer.debug.checkShaderErrors = true;
        return webGLRenderer;
    }

    initAnimate() {
        this.defaultWebGLRenderer.setAnimationLoop(this.animate.bind(this));
    }

    animate() {
        // 
        const clock = this.viewer.clock;
        const delta = clock.getDelta();
        // this.eventManager.animateSubject.next(delta);
        // if ( this.view3DHelper.animating) {
        //     this.view3DHelper.update( delta );
        // }

    }

    render() {
        const scene = this.viewer.scene;
        const eventManager = this.viewer.eventManager;

        const clock = this.viewer.clock;
        const delta = clock.getDelta();
        // this.defaultWebGLRenderer.autoClear = false;
        // this.defaultWebGLRenderer.setClearColor("red");
        const cameraControls = this.cameraManager.cameraControls;

        const updated = cameraControls.update(delta);
        // 

        this.defaultWebGLRenderer.render(this.scene, this.camera);

        // 

        // if (this.editor.view3DHelper.animating) {
        // cameraControls.enabled = false;
        // this.editor.view3DHelper.update(1);
        // } else {
        // cameraControls.enabled = true;
        // }

        // todo
        if (this.sceneHelpers.visible) {
            this.defaultWebGLRenderer.render(this.sceneHelpers, this.camera);
        }
        // todo 和相机的默认 控制冲突
        // if (this.editor.view3DHelper.animating) {
        //     this.editor.view3DHelper.update(delta);
        // }else {
        //
        // }
        // this.editor.view3DHelper.render(this.defaultWebGLRenderer);

        // eventManager.renderSubject.next(delta);
        // todo
        // this.defaultWebGLRenderer.setAnimationLoop()
        // this.defaultWebGLRenderer.autoClear = true;
        // }
    }
}

