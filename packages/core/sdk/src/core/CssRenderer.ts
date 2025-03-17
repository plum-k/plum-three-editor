import {Component, IComponentOptions} from "./Component";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";

export interface ICssRendererOptions extends IComponentOptions {
}

export class CssRenderer extends Component {
    css2DRenderer: CSS2DRenderer;
    css3DRenderer: CSS3DRenderer;
    enableCss2D: boolean = false
    enableCss3D: boolean = false

    constructor(options: ICssRendererOptions) {
        super(options);

        this.css2DRenderer = new CSS2DRenderer()
        this.css3DRenderer = new CSS3DRenderer()

    }

    setSize(width: number, height: number) {
        this.renderManager.setSize(width, height);
        this.cameraManager.setSize(width, height);
    }

    render() {
        if (this.enableCss3D) {
            this.css3DRenderer.render(this.scene, this.camera);
        }
        if (this.enableCss2D) {
            this.css2DRenderer.render(this.scene, this.camera);
        }
    }
}