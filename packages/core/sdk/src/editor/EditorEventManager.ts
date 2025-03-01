import {BehaviorSubject, merge, Subject} from 'rxjs';
import {IModuleOptions, Module} from "../core/Module";
import * as THREE from 'three';

export interface IEditorEventManagerOptions extends IModuleOptions {
}

export interface IPick {
    intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[];
    position: THREE.Vector3
}

export class EditorEventManager extends Module {
    editScript = new Subject<any>();

    startPlayer = new Subject<any>();
    stopPlayer = new Subject<any>();

    enterXR = new Subject<any>();
    offerXR = new Subject<any>();
    leaveXR = new Subject<any>();

    editorCleared = new Subject<any>();
    savingStarted = new Subject<any>();
    savingFinished = new Subject<any>();

    transformModeChanged = new Subject<any>();

    snapChanged = new Subject<any>();
    spaceChanged = new Subject<any>();

    rendererCreated = new Subject<any>();
    rendererUpdated = new Subject<any>();

    rendererDetectKTX2Support = new Subject<any>();
    sceneBackgroundChanged = new Subject<any>();

    sceneEnvironmentChanged = new Subject<any>();
    sceneFogChanged = new Subject<any>();

    sceneFogSettingsChanged = new Subject<any>();

    // 场景变化事件
    sceneGraphChanged = new BehaviorSubject(null);


    cameraChanged = new Subject<any>();
    cameraResetted = new Subject<any>();

    geometryChanged = new Subject<any>();

    // 在三维中选择物体
    objectSelected = new Subject<THREE.Object3D | undefined>();

    // 定义一个名为objectFocused的Subject，用于处理对象被聚焦相关的事件或操作
    // 当场景中的某个对象被聚焦（可能是视觉上的突出显示等）时，可通过这个Subject传播相关信息
    objectFocused = new Subject<any>();

    // 对象天加事件
    objectAdded = new Subject<any>();
    // 对象属性改变事件
    objectChanged = new Subject<any>();
    // 对象移除事件
    objectRemoved = new Subject<any>();


    cameraAdded = new Subject<any>();
    cameraRemoved = new Subject<any>();

    helperAdded = new Subject<any>();
    helperRemoved = new Subject<any>();

    materialAdded = new Subject<any>();
    materialChanged = new Subject<any>();
    materialRemoved = new Subject<any>();

    scriptAdded = new Subject<any>();
    scriptChanged = new Subject<any>();
    scriptRemoved = new Subject<any>();

    windowResize = new Subject<any>();

    showHelpersChanged = new Subject<any>();

    refreshSidebarObject3D = new Subject<any>();
    refreshSidebarEnvironment = new Subject<any>();

    historyChanged = new Subject<any>();

    viewportCameraChanged = new Subject<any>();
    viewportShadingChanged = new Subject<any>();

    intersectionsDetected = new Subject<any>();

    pathTracerUpdated = new Subject<any>();


    constructor(options: IEditorEventManagerOptions) {
        super(options);
        this.mergeSubject();
    }

    mergeSubject() {
        // 合并事件并派发
        merge(this.objectAdded, this.objectRemoved)
            // merge(this.objectAdded, this.objectChanged, this.objectRemoved)
            // merge(this.objectAdded)
            .subscribe(value => {
                this.sceneGraphChanged.next(value)
            });
    }
}
