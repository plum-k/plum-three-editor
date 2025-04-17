import {SRGBColorSpace, WebGLRenderer} from "three";
import {Component, IComponentOptions} from "./Component";
import {WebGPURenderer} from "three/src/Three.WebGPU";

export interface IRenderComponentOptions extends IComponentOptions {
}

export class RenderComponent extends Component {
    // defaultWebGLRenderer: WebGPURenderer;
    defaultWebGLRenderer: WebGLRenderer;

    constructor(options: IRenderComponentOptions) {
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

        // todo 后处理模块目前不支持 webgpu
        // const renderer = new WebGPURenderer({

        const renderer = new WebGLRenderer({
            // const webGLRenderer = new WebGLRenderer({
            powerPreference: "high-performance",
            // alpha: true,
            antialias: true,
            stencil: false,
            depth: true
        })
        // Object.defineProperty(webGLRenderer, "autoClear", {
        //     get: ()=> {
        //         return false
        //     },
        //     set: (newContext) =>{
        //         logStack("111",newContext)
        //     },
        //     configurable: true, // 允许后续修改该属性的描述符
        //     enumerable: true // 使该属性可枚举
        // });

        renderer.outputColorSpace = SRGBColorSpace;
        renderer.debug.checkShaderErrors = true;
        return renderer;
    }

    initAnimate() {
        this.defaultWebGLRenderer.setAnimationLoop(this.animate.bind(this));
    }

    animate() {
        // 
        const clock = this.viewer.clock;
        const delta = clock.getDelta();
    }

    render(timestamp?: number) {
        const scene = this.viewer.scene;
        const eventManager = this.viewer.eventComponent;

        const clock = this.viewer.clock;
        const delta = clock.getDelta();
        // this.renderer.autoClear = false;
        // this.renderer.setClearColor("red");
        // const cameraControls = this.cameraManager.cameraControls;
        //
        // const updated = cameraControls.update(delta);
        // 

        this.defaultWebGLRenderer.render(this.scene, this.camera);
        if (this.sceneHelpers.visible) {
            this.defaultWebGLRenderer.render(this.sceneHelpers, this.camera);
        }
    }
}

