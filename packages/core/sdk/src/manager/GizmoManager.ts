import {GizmoOptions, ViewportGizmo} from "three-viewport-gizmo";
import {Component, IComponentOptions} from "../core";

export interface IGizmoOptions extends IComponentOptions {
}


export class GizmoManager extends Component {

    cubeGizmo: ViewportGizmo | undefined;
    sphereGizmo: ViewportGizmo | undefined;

    constructor(options: IGizmoOptions) {
        super(options);
    }

    initSphereGizmo() {
        this.sphereGizmo = new ViewportGizmo(this.camera, this.renderer, {
            container: this.container,
            placement: "top-right",
            lineWidth: 10,
            corners: {
                // enabled: true,
            },
            edges: {
                // enabled: true,
            },
        });
        const cameraControls = this.cameraControls;
        const camera = this.camera;

        this.sphereGizmo.addEventListener("start", () => {
            cameraControls.enabled = false
        });
        this.sphereGizmo.addEventListener("end", () => {
            cameraControls.enabled = true
        });
        this.sphereGizmo.addEventListener("change", () => {
            cameraControls.setPosition(...camera.position.toArray()).then();
        });

        cameraControls.addEventListener("update", () => {
            cameraControls.getTarget(this.sphereGizmo!.target);
            this.sphereGizmo!.update();
        });

        this.eventManager.renderSubject.subscribe(() => {
            this.sphereGizmo!.render();
        })

        this.eventManager.resizeSubject.subscribe(() => {
            this.sphereGizmo!.update();
        })
    }

    initCubeGizmo() {
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


        this.cubeGizmo = new ViewportGizmo(this.camera, this.renderer, darkCubeConfig);
        const cameraControls = this.cameraControls;
        const camera = this.camera;

        // Set the events listeners
        this.cubeGizmo.addEventListener("start", () => {
            cameraControls.enabled = false
        });
        this.cubeGizmo.addEventListener("end", () => {
            cameraControls.enabled = true
        });
        this.cubeGizmo.addEventListener("change", () => {
            cameraControls.setPosition(...camera.position.toArray()).then();
        });

        cameraControls.addEventListener("update", () => {
            cameraControls.getTarget(this.cubeGizmo!.target);
            this.cubeGizmo!.update();
        });

        this.eventManager.renderSubject.subscribe(() => {
            this.cubeGizmo!.render();
        })

        this.eventManager.resizeSubject.subscribe(() => {
            this.cubeGizmo!.update();
        })
    }
}