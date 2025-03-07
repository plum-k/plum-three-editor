import {isString} from "lodash-es"; // 从 lodash-es 导入工具函数
import * as THREE from 'three'; // 导入 Three.js 库
import {AxesHelper, Object3D} from 'three'; // 导入深度合并工具
import {
    AssetManager,
    DebugManager,
    EventManager,
    HelperManager,
    Loop,
    PostProcessingManager,
    RenderManager
} from "../manager"; // 导入渲染管理类
import {Editor} from "../editor"; // 导入编辑器类
import {Pick} from "./Pick"; // 导入拾取类
import {EnvironmentManage} from "./environment"; // 导入环境类
import {deepMergeRetain, DownloadTool, ESearchMode, ICondition, Search} from "../tool";
import {DrawLine, MeasureTool, CameraManager} from "../control";
import {CssRenderer} from "./CssRenderer";
import {IOssApiOptions, OssApi} from "@plum-render/oss-api";
import {Grid} from "../mesh";
import {Subject} from "rxjs";
import {getPackage} from "../serializeManage/PackageFactory";
import {Package} from "../serializeManage/package";
import {PScene} from "./PScene";
import {GizmoManager} from "../manager/GizmoManager";

/**
 * 定义场景加载类型的枚举
 */
export enum ESceneLoadType {
    Load,
    /**
     * 表示场景加载类型为下载，即从网络或其他数据源下载场景资源
     */
    Down,
    /**
     * 表示场景加载类型为解压，即对下载后的压缩场景资源进行解压操作
     */
    UnZip
}

/**
 * 定义场景加载进度事件的接口
 */
export interface ISceneLoadProgressEvent {
    /**
     * 当前场景加载操作的类型，取值为 ISceneLoadType 枚举中的值
     */
    type: ESceneLoadType;
    /**
     * 操作的名称
     */
    name: string;
    /**
     * 场景加载任务的总工作量，可以是字节数、文件数量等，具体含义取决于加载类型
     */
    total: number;
    /**
     * 当前场景加载任务已经完成的工作量，与 total 采用相同的度量单位
     */
    loaded: number;
}

export enum ESceneSaveType {
    Save,
    Put,
    Zip
}

export interface ISceneSaveProgressEvent {
    type: ESceneSaveType;
    name: string;
    total: number;
    loaded: number;
}

// 定义 Viewer 选项接口
export interface IViewerOptions {
    /**
     * 应用程序的唯一标识符。
     */
    appId?: string;

    /**
     * 资源包的路径，用于加载相关资源。
     */
    packagePath?: string;

    // 基础路径
    ossBaseUrl?: string;
    /**
     * 包的类型
     * - "part": 渐进式加载
     * - "chunk": 切片包
     * - "native": 原生包
     */
    packageType?: "part" | "chunk" | "native";
    /**
     * cos 配置
     */
    ossApiOptions?: IOssApiOptions;

    /**
     * 是否创建默认光源，默认为 false。
     */
    isCreateDefaultLight?: boolean;

    /**
     * 是否创建默认环境，默认为 false。
     */
    isCreateDefaultEnvironment?: boolean;
    /**
     * 显示小控件
     */
    isCubeGizmo?: boolean;
    isSphereGizmo?: boolean;
}

export class Viewer {
    options: IViewerOptions; // 存储选项
    container!: HTMLElement; // 容器元素
    clock: THREE.Clock; // 定时器
    animationMixer: THREE.AnimationMixer; // 动画混合器
    scene: THREE.Scene; // 主场景

    // 各种管理类
    eventManager: EventManager; // 事件管理
    assetManager: AssetManager; // 资源管理
    renderManager: RenderManager; // 渲染管理
    helperManager: HelperManager; // 辅助管理
    gizmoManager: GizmoManager;
    postProcessingManager: PostProcessingManager; // 后处理管理
    debug: DebugManager; // 调试管理
    loop: Loop; // 循环管理
    cssRenderer!: CssRenderer; // CSS 渲染器
    //-----------------

    cameraManager: CameraManager; // 相机控制
    sceneHelpers: THREE.Scene; // 场景辅助
    pick: Pick; // 拾取
    environmentManage: EnvironmentManage; // 环境
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
    initComponentSubject = new Subject();
    // 场景初始化完成
    initSubject = new Subject();
    //---------- 事件
    // 场景加载进度
    sceneLoadProgressSubject = new Subject<ISceneLoadProgressEvent>();
    // 场景保存进度
    sceneSaveProgressSubject = new Subject<ISceneSaveProgressEvent>();
    serializer: Package | undefined;
    #enableGrid = false;
    #enableAxes = false;

    //------------------
    isLoad = false;

    constructor(container: string | HTMLDivElement, options: IViewerOptions = {}) {
        this.options = deepMergeRetain({
            ossBaseUrl: "three",
            isGizmo: false,
        },options); // 合并选项
        this.initContainer(container); // 初始化容器

        this.clock = new THREE.Clock(); // 创建时钟实例

        // 初始化场景
        this.scene = new PScene();
        this.scene.name = "scene"; // 设置场景名称

        // 初始化场景辅助
        this.sceneHelpers = new PScene();
        this.sceneHelpers.name = "sceneHelpers"; // 设置辅助场景名称

        // 初始化各个管理类
        this.eventManager = new EventManager({viewer: this});
        this.renderManager = new RenderManager({viewer: this});
        this.postProcessingManager = new PostProcessingManager({viewer: this});
        this.cameraManager = new CameraManager({viewer: this});
        this.helperManager = new HelperManager({viewer: this});
        this.assetManager = new AssetManager({viewer: this});
        this.pick = new Pick({viewer: this});
        this.cssRenderer = new CssRenderer({viewer: this});
        this.environmentManage = new EnvironmentManage({viewer: this});
        this.drawLine = new DrawLine({viewer: this});
        this.measureTool = new MeasureTool({viewer: this});
        this.gizmoManager = new GizmoManager({viewer: this});
        this.animationMixer = new THREE.AnimationMixer(this.scene); // 创建动画混合器实例

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
    }

    //------------------------- 添加网格 开始 -------------------
    get enableGrid() {
        return this.#enableGrid;
    }

    set enableGrid(enable: boolean) {
        if (enable) {
            this.grid = new Grid({});
            this.grid.name = "grid";
            this.sceneHelpers.add(this.grid);
            this.loop.addEffect(() => {
                this.grid!.tick(this.cameraManager.camera)
            })
        } else {
            if (!this.grid) return;
            this.grid.geometry.dispose();
            (this.grid.material as THREE.Material).dispose();
            this.sceneHelpers.remove(this.grid);
        }
        this.#enableGrid = enable;
    }

    get enableAxes() {
        return this.#enableAxes;
    }

    set enableAxes(enable: boolean) {
        if (enable) {
            this.axesHelper = new THREE.AxesHelper(100);
            this.sceneHelpers.add(this.axesHelper);
        } else {
            if (!this.axesHelper) return;
            this.axesHelper.geometry.dispose();
            (this.axesHelper.material as THREE.Material).dispose();
            this.sceneHelpers.remove(this.axesHelper);
        }
        this.#enableAxes = enable;
    }

    /**
     * 创建 Viewer
     * @param container 容器
     * @param options 配置项
     */
    static async create(container: string | HTMLDivElement, options ?: IViewerOptions): Promise<Viewer> {
        return new Promise<Viewer>((resolve) => {
            const viewer = new Viewer(container, options); // 创建 Viewer 实例
            viewer.initComponentSubject.subscribe(() => {
                resolve(viewer);
            });
        });
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

        this.initSubject.subscribe(() => {
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
        return new THREE.Vector2(width, height); // 返回 Vector2 对象
    }

    // 设置渲染器和控制器的大小
    setSize() {
        const {width, height} = this.getSize(); // 获取大小
        this.cameraManager.setSize(width, height); // 设置相机控制器大小
        this.renderManager.setSize(width, height); // 设置渲染器大小
        this.cssRenderer.setSize(width, height); // 设置 CSS 渲染器大小
        this.postProcessingManager.setSize(width, height); // 设置后处理管理器大小
        this.renderManager.render(); // 重置后必须重新渲染. 不然会闪烁
    }

    //--------------------- 截屏

    capture() {
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
    toJSON(){
        const sceneJson = this.scene.toJSON();
        const cameraManager = this.cameraManager.toJSON();
        return {
            scene: sceneJson,
            cameraManager
        }
    }

}