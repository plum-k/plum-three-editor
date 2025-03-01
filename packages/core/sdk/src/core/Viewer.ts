import {isString} from "lodash-es"; // 从 lodash-es 导入工具函数
import * as THREE from 'three'; // 导入 Three.js 库
import {AxesHelper} from 'three';
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
import {Environment} from "./environment"; // 导入环境类
import {Object3D} from "three/src/core/Object3D"; // 导入深度合并工具
import {deepMergeRetain, ESearchMode, ICondition, Search} from "../tool";
import {SerializeScene} from "./SerializeScene";
import {DrawLine, MeasureTool, ThreeCameraControls} from "../control";
import {CssRenderer} from "./CssRenderer";
import {IOssApiOptions, OssApi} from "@plum-render/oss-api";
import {Grid} from "../mesh";

// 定义 Viewer 选项接口
export interface IViewerOptions {
    appUrl?: string; // 应用程序的 URL（可选）
    /**
     * cos 配置
     */
    ossApiOptions?: IOssApiOptions;
}

// 定义 Viewer 类
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
    postProcessingManager: PostProcessingManager; // 后处理管理
    debug: DebugManager; // 调试管理
    loop: Loop; // 循环管理
    cssRenderer!: CssRenderer; // CSS 渲染器
    //-----------------

    threeCameraControls: ThreeCameraControls; // 相机控制
    sceneHelpers: THREE.Scene; // 场景辅助
    pick: Pick; // 拾取
    environment: Environment; // 环境
    // @ts-ignore
    drawLine!: DrawLine; // 绘制直线
    measureTool: MeasureTool; // 测量工具

    serializeScene: SerializeScene;

    editor: Editor; // 编辑器

    // 阿里对象存储
    ossApi: OssApi | null = null;

    // 构造函数
    constructor(container: string | HTMLDivElement, options: IViewerOptions = {}) {
        this.options = deepMergeRetain(options, {}); // 合并选项
        this.initContainer(container); // 初始化容器


        this.clock = new THREE.Clock(); // 创建时钟实例

        // 初始化场景
        this.scene = new THREE.Scene();
        this.scene.name = "scene"; // 设置场景名称

        // 初始化场景辅助
        this.sceneHelpers = new THREE.Scene();
        this.sceneHelpers.name = "sceneHelpers"; // 设置辅助场景名称

        // 初始化各个管理类
        this.eventManager = new EventManager({viewer: this});
        this.renderManager = new RenderManager({viewer: this});
        this.postProcessingManager = new PostProcessingManager({viewer: this});
        this.threeCameraControls = new ThreeCameraControls({viewer: this});
        this.helperManager = new HelperManager({viewer: this});
        this.assetManager = new AssetManager({viewer: this});
        this.pick = new Pick({viewer: this});
        this.cssRenderer = new CssRenderer({viewer: this});
        this.environment = new Environment({viewer: this});
        this.drawLine = new DrawLine({viewer: this});
        this.measureTool = new MeasureTool({viewer: this});

        this.serializeScene = new SerializeScene({viewer: this});

        this.animationMixer = new THREE.AnimationMixer(this.scene); // 创建动画混合器实例

        this.addCanvasToContainer(); // 将画布添加到容器
        this.setSize(); // 设置初始大小

        // 订阅窗口大小变化事件
        this.eventManager.resizeSubject.subscribe(size => {
            this.setSize(); // 调整大小
        });

        this.debug = new DebugManager({viewer: this}); // 初始化调试管理
        this.loop = new Loop({viewer: this}); // 初始化循环管理

        this.editor = new Editor({viewer: this}); // 初始化编辑器
        this.editor.initComponent();

        this.loop.startLoop(); // 启动循环
        if (this.options.appUrl != null) {
            this.serializeScene.loadSceneByUrl(this.options.appUrl);
        } // 根据 URL 加载场景
        // todo
        this.initComponent().then();
    }

    async initComponent() {
        if (this.options.ossApiOptions) {
            this.ossApi = await OssApi.create(this.options.ossApiOptions);
        }
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
        this.renderManager.setSize(width, height); // 设置渲染器大小
        this.threeCameraControls.setSize(width, height); // 设置相机控制器大小
        this.cssRenderer.setSize(width, height); // 设置 CSS 渲染器大小
        this.postProcessingManager.setSize(width, height); // 设置后处理管理器大小
    }

    //------------------------- 添加网格 开始 -------------------
    grid: Grid | undefined = undefined;

    #enableGrid = false;
    set enableGrid(enable: boolean) {
        if (enable) {
            this.grid = new Grid({});
            this.grid.name = "grid";
            this.sceneHelpers.add(this.grid);
            this.loop.addEffect(() => {
                this.grid!.tick(this.threeCameraControls.camera)
            })
        } else {
            if (!this.grid) return;
            this.grid.geometry.dispose();
            (this.grid.material as THREE.Material).dispose();
            this.sceneHelpers.remove(this.grid);
        }
        this.#enableGrid = enable;
    }

    get enableGrid() {
        return this.#enableGrid;
    }

    //---------------------- 坐标轴--------------------
    #enableAxes = false;
    axesHelper: AxesHelper | undefined = undefined;

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

    get enableAxes() {
        return this.#enableAxes;
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


}