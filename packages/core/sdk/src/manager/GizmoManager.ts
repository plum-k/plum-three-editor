import {GizmoOptions, ViewportGizmo} from "three-viewport-gizmo";
import {Component, IComponentOptions} from "../core";

export interface IGizmoOptions extends IComponentOptions {
}

function getGizmoConfig(): GizmoOptions {
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

    const darkCubeConfig = {
        type: "cube",
        background: darkBackground,
        corners: darkColors,
        edges: darkColors,
        right: darkColors,
        top: darkColors,
        front: darkColors,
    };

    return darkCubeConfig as  GizmoOptions;
}

export class GizmoManager extends Component {

    viewportGizmo: ViewportGizmo

    constructor(options: IGizmoOptions) {
        super(options);

        this.viewportGizmo = new ViewportGizmo(this.camera, this.renderer, getGizmoConfig());
        const cameraControls = this.cameraControls;
        const camera = this.camera;

        // Set the events listeners
        this.viewportGizmo.addEventListener("start", () => (cameraControls.enabled = false));
        this.viewportGizmo.addEventListener("end", () => (cameraControls.enabled = true));
        this.viewportGizmo.addEventListener("change", () => {
            cameraControls.setPosition(...camera.position.toArray()).then();
        });

        cameraControls.addEventListener("update", () => {
            cameraControls.getTarget(this.viewportGizmo.target);
            this.viewportGizmo.update();
        });

        this.eventManager.renderSubject.subscribe(() => {
            this.viewportGizmo.render();
        })

        this.eventManager.resizeSubject.subscribe(() => {
            this.viewportGizmo.update();
        })
    }


}