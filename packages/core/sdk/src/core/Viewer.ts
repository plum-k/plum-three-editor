import {defaults, isString} from "lodash-es"; // 从 lodash-es 导入工具函数
import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    AxesHelper,
    Clock,
    Color,
    Float32BufferAttribute,
    Object3D,
    Scene,
    Vector2
} from 'three'; // 导入深度合并工具
import {
    AssetManager,
    DebugManager,
    EventManager,
    HelperManager,
    IRenderSubjectValue,
    Loop,
    PostProcessingComponent,
    RenderManager
} from "../manager"; // 导入渲染管理类
import {Editor} from "../editor"; // 导入编辑器类
import {PickComponent} from "./PickComponent"; // 导入拾取类
import {EnvironmentComponent} from "./environment"; // 导入环境类
import {deepMergeRetain, DownloadTool, ESearchMode, ICondition, Search} from "../tool";
import {CameraManager, DrawLine, MeasureTool} from "../control";
import {CssRendererComponent} from "./CssRendererComponent";
import {OssApi} from "@plum-render/oss-api";
import {Grid} from "../mesh";
import {BehaviorSubject, Subject} from "rxjs";
import {getPackage, Package} from "../serializeManage";
import {PScene} from "./PScene";
import {GizmoManager} from "../manager/GizmoManager";
import {
    ESceneLoadType,
    ISceneLoadProgressEvent,
    ISceneSaveProgressEvent,
    ISetAxes,
    ISetGrid,
    IViewerOptions
} from "../interface";

export class Viewer {
    options: IViewerOptions; // 存储选项
    container!: HTMLElement; // 容器元素
    clock: Clock; // 定时器
    animationMixer: AnimationMixer; // 动画混合器
    scene: Scene; // 主场景

    // 各种管理类
    eventManager: EventManager; // 事件管理
    assetManager: AssetManager; // 资源管理
    renderManager: RenderManager; // 渲染管理
    helperManager: HelperManager; // 辅助管理
    gizmoManager: GizmoManager;
    postProcessingComponent: PostProcessingComponent; // 后处理管理
    debug: DebugManager; // 调试管理
    loop: Loop; // 循环管理
    cssRendererComponent!: CssRendererComponent; // CSS 渲染器
    //-----------------

    cameraManager: CameraManager; // 相机控制
    sceneHelpers: Scene; // 场景辅助
    pick: PickComponent; // 拾取
    environmentManage: EnvironmentComponent; // 环境
    // @ts-ignore
    drawLine!: DrawLine; // 绘制直线
    measureTool: MeasureTool; // 测量工具

    editor: Editor; // 编辑器

    // 阿里对象存储
    ossApi: OssApi | null = null;
    //=----------------------- 辅组对象
    grid: Grid | undefined = undefined;
    axesHelper: AxesHelper | undefined = undefined;
    // 初始化组件完成
    initComponentSubject = new BehaviorSubject(false);
    // 场景初始化完成
    initSubject = new BehaviorSubject(false);
    //---------- 事件
    // 场景加载进度
    sceneLoadProgressSubject = new Subject<ISceneLoadProgressEvent>();
    // 场景保存进度
    sceneSaveProgressSubject = new Subject<ISceneSaveProgressEvent>();
    serializer: Package | undefined;
    isLoad = false;
    prevActionsInUse = 0;
    //------------------------- 添加网格 开始 -------------------
    gridOptions: ISetGrid | undefined;
    axesOptions: ISetAxes | undefined;
    // 动画运动状态管理
    actionMap = new Map<Object3D, AnimationAction[]>();
    #enableGrid = false;

    constructor(container: string | HTMLDivElement, options: IViewerOptions = {}) {
        this.options = deepMergeRetain({
            ossBaseUrl: "three",
            isGizmo: false,
            scene: {
                background: new Color("black")
            }
        }, options); // 合并选项
        this.initContainer(container); // 初始化容器

        this.clock = new Clock(); // 创建时钟实例

        // 初始化场景
        this.scene = new PScene();
        this.scene.name = "scene"; // 设置场景名称
        if (this.options?.scene?.background) {
            this.scene.background = this.options.scene.background;
        }

        // 初始化场景辅助
        this.sceneHelpers = new PScene();
        this.sceneHelpers.name = "sceneHelpers"; // 设置辅助场景名称

        // 初始化各个管理类
        this.eventManager = new EventManager({viewer: this});
        this.renderManager = new RenderManager({viewer: this});
        this.cameraManager = new CameraManager({viewer: this});
        this.postProcessingComponent = new PostProcessingComponent({viewer: this});
        this.helperManager = new HelperManager({viewer: this});
        this.assetManager = new AssetManager({viewer: this});
        this.pick = new PickComponent({viewer: this});
        this.cssRendererComponent = new CssRendererComponent({viewer: this});
        this.environmentManage = new EnvironmentComponent({viewer: this});
        this.drawLine = new DrawLine({viewer: this});
        this.measureTool = new MeasureTool({viewer: this});
        this.gizmoManager = new GizmoManager({viewer: this});
        this.animationMixer = new AnimationMixer(this.scene);

        this.addCanvasToContainer(); // 将画布添加到容器
        this.setSize(); // 设置初始大小

        // 订阅窗口大小变化事件
        this.eventManager.resizeSubject.subscribe(() => {
            this.setSize(); // 调整大小
        });

        this.debug = new DebugManager({viewer: this}); // 初始化调试管理
        this.loop = new Loop({viewer: this}); // 初始化循环管理

        this.editor = new Editor({viewer: this}); // 初始化编辑器
        this.editor.initComponent();

        this.loop.startLoop(); // 启动循环
        this.initComponent().then();

        // 更新动画混合器
        this.eventManager.renderSubject.subscribe(value => {
            this.animationMixerUpdate(value)
        })
    }

    get isEnableGrid() {
        return this.grid !== undefined;
    }

    get isEnableAxes() {
        return this.axesHelper !== undefined;
    }

    /**
     * 创建 Viewer
     * @param container 容器
     * @param options 配置项
     */
    static async create(container: string | HTMLDivElement, options ?: IViewerOptions): Promise<Viewer> {
        return new Promise<Viewer>((resolve) => {
            const viewer = new Viewer(container, options);
            viewer.initComponentSubject.subscribe(() => {
                resolve(viewer);
            });
        });
    }

    animationMixerUpdate(value: IRenderSubjectValue) {
        if (this.animationMixer) {
            const actions = this.animationMixer.stats.actions;
            if (actions.inUse > 0 || this.prevActionsInUse > 0) {
                this.prevActionsInUse = actions.inUse;
                this.animationMixer.update(value.delta);
                const selectObject = this.editor.selector.selectObject;
                // 骨骼运动时, 实时更新下包围盒
                if (selectObject) {
                    selectObject.updateWorldMatrix(false, true);
                    this.editor.selector.selectionBox.box.setFromObject(selectObject, true);
                }
            }
        }
    }

    setGrid(inOptions: ISetGrid) {
        const options = defaults(inOptions, {
            visible: true,
        })

        const {visible} = options;
        if (visible) {
            if (this.grid) {
                this.sceneHelpers.remove(this.grid);
                this.grid.dispose();
            }
            this.grid = new Grid(options);
            this.grid.name = "grid";
            this.sceneHelpers.add(this.grid);
            this.loop.addEffect(() => {
                this.grid!.tick(this.cameraManager.camera)
            })
        } else {
            if (!this.grid) return;
            this.sceneHelpers.remove(this.grid);
            this.grid.dispose();
        }
        this.gridOptions = options;
    }

    setAxes(inOptions: ISetAxes) {
        const options = defaults(inOptions, {
            size: 2000,
            visible: true,
            dispose: false
        })
        const {size, visible, dispose} = options;
        if (this.axesHelper && this.axesOptions) {
            const isSizeChanged = this.axesOptions.size !== size;
            const isVisibleChanged = this.axesOptions.visible !== visible;
            if (isSizeChanged) {
                const vertices = [
                    0, 0, 0, size, 0, 0,
                    0, 0, 0, 0, size, 0,
                    0, 0, 0, 0, 0, size
                ];
                this.axesHelper.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
                this.axesHelper.geometry.attributes.position.needsUpdate = true;
            }
            if (isVisibleChanged) {
                this.axesHelper.visible = visible;
            }
            if (dispose) {
                this.sceneHelpers.remove(this.axesHelper);
                this.axesHelper.dispose();
            }
        } else {
            this.axesHelper = new AxesHelper(size);
            this.sceneHelpers.add(this.axesHelper);
            this.axesHelper.visible = visible;
        }
        this.axesOptions = options;
    }

    /**
     * 初始化场景
     */
    loadScene() {
        const serializer = getPackage(this);
        if (serializer) {
            this.serializer = serializer;
            serializer.loadScene();
        } else {
            this.setInitState();
        }
    }

    setInitState() {
        this.sceneLoadProgressSubject.next({
            type: ESceneLoadType.Load,
            name: `加载场景中`,
            total: 1,
            loaded: 1,
        })
        this.isLoad = true;
        console.log("派发")
        this.initSubject.next(true);
    }

    async initComponent() {
        if (this.options.ossApiOptions) {
            this.ossApi = await OssApi.create(this.options.ossApiOptions);
            this.initComponentSubject.next(true);
        }
        if (this.options.isCubeGizmo) {
            this.gizmoManager.initCubeGizmo();
        }
        if (this.options.isSphereGizmo) {
            this.gizmoManager.initSphereGizmo();
        }
        // todo 监听时机不对 等待修改
        this.initSubject.subscribe((value) => {
            if (!value) return;
            if (this.options.isCreateDefaultLight) {
                this.environmentManage.createDefaultLight();
            }
            if (this.options.isCreateDefaultEnvironment) {
                this.environmentManage.createDefaultEnvironment();
            }
            if (this.editor) {
                this.editor.editorEventManager.sceneGraphChanged.next(true);
            }
            this.eventManager.resizeSubject.next(true);
        })
        this.loadScene();
    }

    // 将画布添加到容器
    addCanvasToContainer() {
        const defaultWebGLRenderer = this.renderManager.defaultWebGLRenderer; // 获取默认的 WebGL 渲染器
        const domElement = defaultWebGLRenderer.domElement; // 获取 DOM 元素
        this.container.appendChild(domElement); // 将 DOM 元素添加到容器
    }

    // 初始化容器
    initContainer(container: string | HTMLDivElement) {
        if (isString(container)) {
            const divDom = document.getElementById(container); // 通过 ID 获取 DOM 元素
            if (divDom !== null) {
                this.container = divDom; // 设置容器
            } else {
                throw new Error(`当前没有找到 id 为 ${container} 的 div 标签`); // 抛出错误
            }
        } else {
            this.container = container; // 设置容器
        }
    }

    // 获取容器的大小
    getSize() {
        const container = this.container; // 获取容器
        const width = container.offsetWidth; // 获取宽度
        const height = container.offsetHeight; // 获取高度
        return {width, height}; // 返回大小
    }

    // 获取大小的 Vector2 对象
    getSizeVector2() {
        const {width, height} = this.getSize(); // 获取大小
        return new Vector2(width, height); // 返回 Vector2 对象
    }

    //--------------------- 截屏

    // 设置渲染器和控制器的大小
    setSize() {
        const {width, height} = this.getSize(); // 获取大小
        this.cameraManager.setSize(width, height); // 设置相机控制器大小
        this.renderManager.setSize(width, height); // 设置渲染器大小
        this.cssRendererComponent.setSize(width, height); // 设置 CSS 渲染器大小
        this.postProcessingComponent.setSize(width, height); // 设置后处理管理器大小
        this.renderManager.render(); // 重置后必须重新渲染. 不然会闪烁
        this.gizmoManager.update();
        this.gizmoManager.render();
    }

    capture() {
        // 渲染一下, 不然会截取不到
        this.renderManager.render();
        return this.renderManager.defaultWebGLRenderer.domElement.toDataURL("image/png");
    }

    captureDown(name: string) {
        const data = this.capture();
        DownloadTool.saveImg(data, name);
    }

    //---------------- 查找节点---------------------
    getObjectByUuid(uuid: string) {
        return this.scene.getObjectByProperty('uuid', uuid);
    }

    search(array: Array<ICondition>, searchMode: ESearchMode = ESearchMode.MatchAll) {
        const search = new Search(array, searchMode);
        let result: Array<Object3D> = [];
        this.scene.traverse((target) => {
            const isMatch = search.matching(target);
            if (isMatch) {
                result.push(target);
            }
        })
        return result;
    }

    //-------------------
    toJSON() {
        const sceneJson = this.scene.toJSON();
        const cameraManager = this.cameraManager.toJSON();
        return {
            scene: sceneJson,
            cameraManager
        }
    }

    //----------------------------------

    //-----------------
    /**
     * 同步场景
     * @param scene
     */
    syncScene(scene: Scene) {
        // 如果启用了编辑器模式, 做额外处理
        // todo
        if (this.editor) {
            // 同步场景时, 只派发一次场景图变化信号
            this.editor.isAddObjectSceneGraphChangedNext = false;
            while (scene.children.length > 0) {
                this.editor.addObject(scene.children[0]);
            }
            this.editor.isAddObjectSceneGraphChangedNext = true;
            this.editor.editorEventManager.sceneGraphChanged.next(true);
        } else {
            this.scene = scene;
        }
    }

    /**
     * 获取动画运动状态
     * @param object
     * @param animation
     */
    getAction(object: Object3D, animation: AnimationClip) {
        const animationActionArray = this.actionMap.get(object);
        if (animationActionArray) {
            for (const animationAction of animationActionArray) {
                const clip = animationAction.getClip();
                if (clip === animation) {
                    return animationAction;
                }
            }
            const action = this.animationMixer.clipAction(animation, object);
            animationActionArray.push(action);
            this.actionMap.set(object, animationActionArray);
            return action;
        } else {
            const action = this.animationMixer.clipAction(animation, object);
            this.actionMap.set(object, [action]);
            return action;
        }
    }
}
