import {Component, IComponentOptions} from "../core/Component";
import * as THREE from "three";
import {Texture} from "three";
import {PropertyPath} from "lodash-es";
import {History} from "./History"
import {
    AddObjectCommand,
    Command,
    MoveObjectCommand,
    RemoveObjectCommand,
    SetColorCommand,
    SetMaterialColorCommand,
    SetMaterialCommand,
    SetMaterialMapCommand,
    SetMaterialValueCommand,
    SetValueCommand
} from "./commands";
import {
    isBone,
    isCamera,
    isDirectionalLight,
    isHemisphereLight,
    isMesh,
    isPointLight,
    isSkinnedMesh,
    isSpotLight
} from "three-is";
import {Tool} from "../tool";
import {EditorEventManager} from "./EditorEventManager";
import {Selector} from "./Selector";
import {TransformControlsWarp} from "./TransformControlsWarp";
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper";

export interface IAppearanceStates {
    cameraHelpers: boolean;
    lightHelpers: boolean;
    skeletonHelpers: boolean
}

export interface IEditorOptions extends IComponentOptions {
}

export class Editor extends Component {
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

    setValueExecute(object: THREE.Object3D, attributeName: PropertyPath, newValue: any, oldValue: any = undefined) {
        this.execute(new SetValueCommand(object, attributeName, newValue, oldValue))
    }

    setColorValueCommand(object: THREE.Object3D, attributeName: PropertyPath, newValue: any, oldValue: any = undefined) {
        this.execute(new SetColorCommand(object, attributeName, newValue, oldValue))
    }

    setMaterialExecute(object: THREE.Object3D, newValue: THREE.Material, materialSlot: number = -1) {
        this.execute(new SetMaterialCommand(object, newValue, materialSlot,))
    }

    setMaterialColorExecute(object: THREE.Object3D, attributeName: PropertyPath, newValue: number, materialSlot: number = -1) {
        this.execute(new SetMaterialColorCommand(object, attributeName, newValue, materialSlot))
    }

    setMaterialValueExecute(object: THREE.Object3D, attributeName: PropertyPath, newValue: any, materialSlot: number = -1) {
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
        const object = Tool.getObjectByUuid(this.scene, objectUUid)!;
        const newParent = Tool.getObjectByUuid(this.scene, newParentUUid)!;
        // 
        this.execute(new MoveObjectCommand(object, newParent, newBefore))
    }

    //------------------ 回退 结束-----------------
    // 是否添加对象时, 派发了场景图变化信号
    isAddObjectSceneGraphChangedNext: boolean = false;

    /**
     * 添加对象
     * @param object
     * @param parent
     * @param index
     */
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
        if (this.isAddObjectSceneGraphChangedNext) {
            this.editorEventManager.sceneGraphChanged.next(true);
        }
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
    /**
     * 添加帮助对象
     * @param object
     * @param helper
     */
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
            } else if (isBone(object) === true && object.parent && isBone(object.parent) !== true) {
                helper = new THREE.SkeletonHelper(object);
            } else {
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

    appearanceStates: IAppearanceStates = {
        cameraHelpers: false,
        lightHelpers: true,
        skeletonHelpers: true
    }

    showHelper(inAppearanceStates: IAppearanceStates) {
        this.appearanceStates = inAppearanceStates;
        this.sceneHelpers.traverse((object) => {
            switch (object.type) {
                case 'CameraHelper': {
                    object.visible = this.appearanceStates.cameraHelpers;
                    break;
                }
                case 'PointLightHelper':
                case 'DirectionalLightHelper':
                case 'SpotLightHelper':
                case 'HemisphereLightHelper': {
                    object.visible = this.appearanceStates.lightHelpers;
                    break;
                }
                case 'SkeletonHelper': {
                    object.visible = this.appearanceStates.skeletonHelpers;
                    break;
                }
                default: {
                    // not a helper, skip.
                }
            }
        });
    }

    /**
     * 移除帮助对象
     * @param object
     */
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

    /**
     * 显示法线
     * @param object
     */
    showNormals(object: THREE.Object3D) {
        if (this.helpers.get(object.uuid) === undefined) {
            this.addHelper(object, new VertexNormalsHelper(object));
        } else {
            this.removeHelper(object);
        }
    }

    /**
     * 更新帮助对象
     * @param object
     */
    helperUpdate(object: THREE.Object3D) {
        let helper = this.helpers.get(object.uuid)
        if (helper) {
            Reflect.apply(Reflect.get(helper, "update"), helper, [])
        }
    }

    /**
     * 设置控制器的变化空间
     * @param space
     */
    setSpace(space: "world" | "local") {
        this.transformControlsWarp.setSpace(space);
    }
}