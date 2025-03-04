import {GizmoOptions, ViewportGizmo} from "three-viewport-gizmo";
import {Component, IComponentOptions} from "../core";

export interface IGizmoOptions extends IComponentOptions {
}


export class GizmoManager extends Component {

    viewportGizmo: ViewportGizmo | undefined;

    constructor(options: IGizmoOptions) {
        super(options);
    }

    init() {
        const darkColors = {
            color: 0x333333,
            labelColor: 0xdddddd,
            hover: {
                color: 0x4bac84,
                labelColor: 0xffffff,
            },
        };

        const darkBackground = {
            color: 0x444444,
            hover: {color: 0x444444},
        };

        const darkCubeConfig: GizmoOptions = {
            container: this.container,
            type: "cube",
            background: darkBackground,
            corners: darkColors,
            edges: darkColors,
            placement: "bottom-right",
            right: {
                label: "右侧",
                ...darkColors
            },
            top: {
                label: "顶部",
                ...darkColors
            },
            front: {
                label: "正面",
                ...darkColors
            },
            left: {
                label: "左侧",
            },
            bottom: {
                label: "底部",
            },
            back: {
                label: "背面",
            },
        };


        this.viewportGizmo = new ViewportGizmo(this.camera, this.renderer, darkCubeConfig);
        const cameraControls = this.cameraControls;
        const camera = this.camera;

        // Set the events listeners
        this.viewportGizmo.addEventListener("start", () => {
            cameraControls.enabled = false
        });
        this.viewportGizmo.addEventListener("end", () => {
            cameraControls.enabled = true
        });
        this.viewportGizmo.addEventListener("change", () => {
            cameraControls.setPosition(...camera.position.toArray()).then();
        });

        cameraControls.addEventListener("update", () => {
            cameraControls.getTarget(this.viewportGizmo!.target);
            this.viewportGizmo!.update();
        });

        this.eventManager.renderSubject.subscribe(() => {
            this.viewportGizmo!.render();
        })

        this.eventManager.resizeSubject.subscribe(() => {
            this.viewportGizmo!.update();
        })
    }
}