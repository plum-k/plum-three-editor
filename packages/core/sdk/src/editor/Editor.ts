import {Module, IModuleOptions } from "../core/Module";
import * as THREE from "three";
import {Texture} from "three";
import {PropertyPath} from "lodash-es";
import {History} from "./History"
import {
    Command,
    SetValueCommand,
    SetMaterialCommand,
    SetMaterialColorCommand,
    SetMaterialValueCommand,
    SetMaterialMapCommand,
    AddObjectCommand,
    MoveObjectCommand,
    RemoveObjectCommand
} from "./commands";
import {
    isCamera,
    isDirectionalLight,
    isHemisphereLight,
    isMesh,
    isPointLight,
    isSkinnedMesh,
    isSpotLight
} from "three-is";

import {Grid} from "../mesh";
import {VertexNormalsHelper} from "three-stdlib";
import {ThreeTool} from "../tool";
import {EditorEventManager} from "./EditorEventManager";
import {Selector} from "./Selector";
import {TransformControlsWarp} from "./TransformControlsWarp";

export interface IEditorOptions extends IModuleOptions  {
}

export class Editor extends Module {
    editorEventManager!: EditorEventManager;
    history!: History;
    selector!: Selector;
    transformControlsWarp!: TransformControlsWarp;
    //------------

    geometries = new Map<string, THREE.BufferGeometry>();
    cameras = new Map<string, THREE.Camera>();
    helpers = new Map<string, THREE.Object3D>();
    materials = new Map<string, THREE.Material>();


    // 材质引用计数
    materialsRefCounter = new Map<THREE.Material, number>();


    constructor(options: IEditorOptions) {
        super(options);
    }

    initComponent() {
        this.history = new History(this);
        this.editorEventManager = new EditorEventManager({
            viewer: this.viewer
        });
        this.transformControlsWarp = new TransformControlsWarp({
            viewer: this.viewer
        });
        this.selector = new Selector({
            viewer: this.viewer
        });
        // this.addGrid();
    }

    objectByUuid(uuid: string) {
        return this.scene.getObjectByProperty('uuid', uuid);
    }

    //------------------ 回退 开始-----------------
    execute(cmd: Command<any>, optionalName?: string) {
        this.history.execute(cmd, optionalName);
    }

    undo() {
        this.history.undo();
    }

    redo() {
        this.history.redo();
    }

    setValueExecute(object: THREE.Object3D, attributePath: PropertyPath, newValue: any, oldValue: any = undefined) {
        // 
        this.execute(new SetValueCommand(object, attributePath, newValue, oldValue))
    }

    setMaterialExecute(object: THREE.Object3D, newValue: THREE.Material, materialSlot: number = -1) {
        // 
        this.execute(new SetMaterialCommand(object, newValue, materialSlot,))
    }

    setMaterialColorExecute(object: THREE.Object3D, attributeName: string = '', newValue: number, materialSlot: number = -1) {
        // 
        this.execute(new SetMaterialColorCommand(object, attributeName, newValue, materialSlot,))
    }

    setMaterialValueExecute(object: THREE.Object3D, attributeName: string = '', newValue: number, materialSlot: number = -1) {
        // 
        this.execute(new SetMaterialValueCommand(object, attributeName, newValue, materialSlot,))
    }

    // setMaterialMapExecute(object: THREE.Object3D, attributeName: string = '', newValue: TexImageSource | OffscreenCanvas, materialSlot: number = -1) {
    //     // 
    //     const texture = new THREE.Texture(newValue)
    //     this.command(new SetMaterialMapCommand(object, attributeName, texture, materialSlot,))
    // }
    setMaterialMapExecute(object: THREE.Object3D, attributeName: string = '', newValue: Texture | null, materialSlot: number = -1) {
        this.execute(new SetMaterialMapCommand(object, attributeName, newValue, materialSlot,))
    }

    removeObjectExecute(object: THREE.Object3D) {
        this.execute(new RemoveObjectCommand(object))
    }

    addObjectExecute(object: THREE.Object3D) {
        this.execute(new AddObjectCommand(object));
    }

    moveObjectExecute(objectUUid: string,
                      newParentUUid: string,
                      newBefore: number) {
        // todo
        const object = ThreeTool.getObjectByUuid(this.scene, objectUUid)!;
        const newParent = ThreeTool.getObjectByUuid(this.scene, newParentUUid)!;
        // 
        this.execute(new MoveObjectCommand(object, newParent, newBefore,))
    }

    //------------------ 回退 结束-----------------

    addObject(object: THREE.Object3D, parent: THREE.Object3D | undefined = undefined, index: number = 0) {
        object.traverse((child) => {
            if (isMesh(child)) {
                if (child.geometry !== undefined) {
                    this.addGeometry(child.geometry);
                }
                if (child.material !== undefined) {
                    this.addMaterial(child.material);
                }
            }
            this.addCamera(child);
            this.addHelper(child);
        });
        if (parent === undefined) {
            this.scene.add(object);
        } else {
            parent.children.splice(index, 0, object);
            object.parent = parent;
        }
        this.editorEventManager.objectAdded.next(object);
        // this.signals.sceneGraphChanged.dispatch();
    }

    addGeometry(geometry: THREE.BufferGeometry) {
        this.geometries.set(geometry.uuid, geometry);
    }

    addMaterial(material: THREE.Material | Array<THREE.Material>) {
        if (Array.isArray(material)) {
            for (let i = 0, l = material.length; i < l; i++) {
                this.addMaterialToRefCounter(material[i]);
            }
        } else {
            this.addMaterialToRefCounter(material);
        }
        this.editorEventManager.materialAdded.next(null);
    }

    addMaterialToRefCounter(material: THREE.Material) {

        let materialsRefCounter = this.materialsRefCounter;

        let count = materialsRefCounter.get(material);

        if (count === undefined) {
            materialsRefCounter.set(material, 1);
            this.materials[material.uuid] = material;
        } else {
            count++;
            materialsRefCounter.set(material, count);
        }
    }

    addCamera(camera: THREE.Object3D) {
        if (isCamera(camera)) {
            this.cameras.set(camera.uuid, camera);
            // this.signals.cameraAdded.dispatch(camera);
        }
    }


    nameObject(object: THREE.Object3D, name: string) {
        object.name = name;
        // this.signals.sceneGraphChanged.dispatch();
        this.editorEventManager.sceneGraphChanged.next(null);
    }

    removeObject(object: THREE.Object3D) {
        if (object.parent === null) return; // avoid deleting the camera or scene
        object.traverse((child) => {
            this.removeCamera(child);
            this.removeHelper(child);
            if (isMesh(child)) {
                this.removeMaterial(child.material);
            }
        });
        object.parent.remove(object);
        this.editor.editorEventManager.objectRemoved.next(object);
    }

    removeMaterial(material: THREE.Material | THREE.Material[]) {
        if (Array.isArray(material)) {
            for (let i = 0, l = material.length; i < l; i++) {
                this.removeMaterialFromRefCounter(material[i]);
            }
        } else {
            this.removeMaterialFromRefCounter(material);
        }
        this.editor.editorEventManager.materialRemoved.next(null);
    }

    removeMaterialFromRefCounter(material: THREE.Material) {
        let count = this.materialsRefCounter.get(material)!;
        count--;
        if (count === 0) {
            this.materialsRefCounter.delete(material);
            this.materials.delete(material.uuid);
            material.dispose();
        } else {
            this.materialsRefCounter.set(material, count);
        }
    }

    removeCamera(camera: THREE.Object3D) {
        if (this.cameras.get(camera.uuid) !== undefined) {
            this.cameras.delete(camera.uuid);
            // @ts-ignore
            camera = undefined;
        }
    }

    //-------------------- 帮助对象相关 开始-------------------
    addHelper(object: THREE.Object3D, helper: THREE.Object3D | undefined = undefined) {
        let geometry = new THREE.SphereGeometry(2, 4, 2);
        let material = new THREE.MeshBasicMaterial({color: 0xff0000, visible: false});
        if (helper === undefined) {
            if (isCamera(object)) {
                helper = new THREE.CameraHelper(object);
            } else if (isPointLight(object)) {
                helper = new THREE.PointLightHelper(object, 1);
            } else if (isDirectionalLight(object)) {
                helper = new THREE.DirectionalLightHelper(object, 1);
            } else if (isSpotLight(object)) {
                helper = new THREE.SpotLightHelper(object);
            } else if (isHemisphereLight(object)) {
                helper = new THREE.HemisphereLightHelper(object, 1);
            } else if (isSkinnedMesh(object)) {
                helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
            } else if (object.isBone === true && object.parent && object.parent.isBone !== true) {
                helper = new THREE.SkeletonHelper(object);
            } else {
                // no helper for this object type
                return;
            }
            const picker = new THREE.Mesh(geometry, material);
            picker.name = 'picker';
            picker.userData.object = object;
            helper.add(picker);
        }
        this.sceneHelpers.add(helper);
        this.helpers.set(object.uuid, helper);
        this.editorEventManager.helperAdded.next(helper);
    }

    removeHelper(object: THREE.Object3D) {
        if (this.helpers.get(object.uuid) !== undefined) {
            let helper = this.helpers.get(object.uuid);
            if (helper) {
                helper?.parent?.remove(helper);
                // todo
                // @ts-ignore
                helper?.dispose();
                this.helpers.delete(object.uuid);
            }
        }
    }

    showNormals(object: THREE.Object3D) {
        if (this.helpers.get(object.uuid) === undefined) {
            this.addHelper(object, new VertexNormalsHelper(object));
        } else {
            this.removeHelper(object);
        }
    }

    helperUpdate(object: THREE.Object3D) {
        let helper = this.helpers.get(object.uuid)
        if (helper) {
            Reflect.apply(Reflect.get(helper, "update"), helper, [])
        }
    }

    //-------------------- 帮助对象相关 结束-------------------

    //--------------------  定位-----------------
    // 定位到场景
    fitToScene() {
        if (this.selector?.selectObject) {

        }
    }

    // 定位到选中的单个对象
    fitToSelected(enableTransition = true) {
        return new Promise((resolve, reject) => {
            if (this.selector?.selectObject) {
                let object = this.selector?.selectObject;
                const box = new THREE.Box3().setFromObject(object);
                let center = new THREE.Vector3();

                // 选择到了 空物体
                if (box.isEmpty()) {
                    box.setFromCenterAndSize(object?.position, new THREE.Vector3(1, 1, 1));
                }

                box.getCenter(center);

                const promises = [];
                const cameraControls = this.viewer.threeCameraControls.cameraControls
                const {polarAngle, azimuthAngle} = cameraControls
                promises.push(cameraControls.fitToBox(box, enableTransition));
                promises.push(cameraControls.rotateTo(azimuthAngle, polarAngle, false));
                promises.push(cameraControls.moveTo(center.x, center.y, center.z, enableTransition));
                return Promise.all(promises);
            } else {
                reject()
            }
        })
    }
}