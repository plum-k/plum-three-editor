import { Component, IComponentOptions } from "./Component";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Subscription } from "rxjs";

// 定义 CSS 渲染组件的选项接口
export interface ICssRendererComponentOptions extends IComponentOptions {
}

// 用于在 Three.js 场景中渲染 2D 和 3D CSS 元素的类
export class CssRendererComponent extends Component {
    // CSS2DRenderer 和 CSS3DRenderer 的实例
    css2DRenderer: CSS2DRenderer;
    css3DRenderer: CSS3DRenderer;

    // 启用或禁用 CSS2D 和 CSS3D 渲染的标志
    enableCss2D: boolean = false;
    enableCss3D: boolean = false;

    // 管理启用状态的私有变量
    #enable = false;

    // 用于处理渲染事件的订阅
    subscription: Subscription | undefined = undefined;

    constructor(options: ICssRendererComponentOptions) {
        super(options);
        this.css2DRenderer = new CSS2DRenderer(); // 初始化 CSS2DRenderer
        this.css3DRenderer = new CSS3DRenderer(); // 初始化 CSS3DRenderer
    }

    // enable 属性的 getter
    get enable() {
        return this.#enable;
    }

    // enable 属性的 setter
    set enable(value: boolean) {
        if (value) {
            // 启用时订阅渲染事件
            if (!this.subscription) {
                this.subscription = this.viewer.eventComponent.renderSubject.subscribe(() => {
                    this.render(); // 在每个事件中调用 render
                });
            }
        } else {
            // 禁用时取消订阅
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.subscription = undefined;
            }
        }
        this.#enable = value; // 更新启用状态
    }

    // 设置渲染器的大小
    setSize(width: number, height: number) {
        this.css2DRenderer.setSize(width, height); // 设置 CSS2DRenderer 的大小
        this.css3DRenderer.setSize(width, height); // 设置 CSS3DRenderer 的大小
    }

    // 渲染场景的方法
    render() {
        if (this.enableCss3D) {
            this.css3DRenderer.render(this.scene, this.camera); // 渲染 3D 元素
        }
        if (this.enableCss2D) {
            this.css2DRenderer.render(this.scene, this.camera); // 渲染 2D 元素
        }
    }
}