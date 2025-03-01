import {IModuleOptions, Module} from "../core/Module";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import * as  THREE from "three";

export interface IControlsManagerOptions extends IModuleOptions {
}


export class TransformControlsWarp extends Module {
    transformControls!: TransformControls;
    objectPositionOnDown = new THREE.Vector3;
    objectRotationOnDown = new THREE.Euler;
    objectScaleOnDown = new THREE.Vector3;

    constructor(options: IControlsManagerOptions) {
        super(options);
        this.initTransformControls()
    }

    initTransformControls() {
        this.transformControls = new TransformControls(this.camera, this.canvas);

        this.transformControls.addEventListener('axis-changed', () => {

        });
        this.transformControls.addEventListener('objectChange', () => {
            if (this.transformControls.object) {
                this.editor.editorEventManager.objectChanged.next(this.transformControls.object);
            }
        });
        this.transformControls.addEventListener('mouseDown', () => {
            const object = this.transformControls.object;
            if (object) {
                this.objectPositionOnDown = object.position.clone();
                this.objectRotationOnDown = object.rotation.clone();
                this.objectScaleOnDown = object.scale.clone();
            }
            this.threeCameraControls.cameraControls.enabled = false;
        });
        this.transformControls.addEventListener('mouseUp', () => {
            const object = this.transformControls.object;
            if (object !== undefined) {
                switch (this.transformControls.getMode()) {
                    case 'translate':
                        if (!this.objectPositionOnDown.equals(object.position)) {
                            this.editor.setValueExecute(object, ["position"], object.position, this.objectPositionOnDown)
                        }
                        break;
                    case 'rotate':
                        if (!this.objectRotationOnDown.equals(object.rotation)) {
                            this.editor.setValueExecute(object, "rotation", object.rotation, this.objectRotationOnDown)
                        }
                        break;
                    case 'scale':
                        if (!this.objectScaleOnDown.equals(object.scale)) {
                            this.editor.setValueExecute(object, "scale", object.rotation, this.objectScaleOnDown)
                        }
                        break;
                }
            }
            this.threeCameraControls.cameraControls.enabled = true;
        });
        const gizmo = this.transformControls.getHelper();
        this.sceneHelpers.add(gizmo);
    }
}
