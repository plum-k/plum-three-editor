import {BehaviorSubject, merge, Subject} from 'rxjs';
import {Component, IComponentOptions} from "../core/Component";
import * as THREE from 'three';
import {Object3D} from 'three';
import {PropertyPath} from "lodash-es";

export interface IEditorEventManagerOptions extends IComponentOptions {
}

export interface IPick {
    intersects: Intersection<Object3D<Object3DEventMap>>[];
    position: Vector3
}

export interface IObjectChangedValue {
    name: PropertyPath;
    object: Object3D
}

export class EditorEventManager extends Component {
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
    sceneGraphChanged = new BehaviorSubject(false);
    // 选择对象名称变化
    selectNameChanged = new Subject<any>();

    cameraChanged = new Subject<any>();
    cameraResetted = new Subject<any>();

    geometryChanged = new Subject<any>();

    // 在三维中选择物体
    objectSelected = new Subject<Object3D | undefined>();

    objectFocused = new Subject<any>();

    // 对象天加事件
    objectAdded = new Subject<any>();
    // 对象属性改变事件
    objectChanged = new Subject<IObjectChangedValue>();
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
