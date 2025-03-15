import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass";
import {Component, IComponentOptions} from "../../core";
import {
    BlendFunction,
    BloomEffect,
    BloomEffectOptions,
    EdgeDetectionMode,
    Effect,
    EffectComposer,
    EffectPass,
    FXAAEffect,
    GridEffect,
    KawaseBlurPass,
    OutlineEffect,
    PixelationEffect,
    PredicationMode,
    RenderPass,
    SelectiveBloomEffect,
    SMAAEffect,
    SMAAPreset,
    SSAOEffect,
} from "postprocessing";
import {HalfFloatType, Object3D} from "three";
import {deepMergeRetain} from "../../tool";
import {isGroup, isMesh} from "three-is";

export interface IPostProcessingOptions extends IComponentOptions {
}

export class PostProcessingComponent extends Component {
    // @ts-ignore
    pixelationEffect: PixelationEffect;

    composer: EffectComposer;
    renderPass!: RenderPass;
    outputPass!: OutputPass;

    selectiveBloomEffect!: SelectiveBloomEffect;
    bloomEffect!: BloomEffect;
    gridEffect!: GridEffect;
    smaaEffect!: SMAAEffect;
    ssaoEffect!: SSAOEffect;
    fxaaEffect!: FXAAEffect;

    selectiveBloomEffectOptions!: BloomEffectOptions;
    bloomEffectOptions!: BloomEffectOptions;
    // gridEffectOptions!: GridEffectOptions;
    // outlineEffectOptions!: OutlineEffectOptions;
    // smaaEffectOptions!: SMAAEffectOptions;
    // ssaoEffectOptions!: SSAOEffectOptions;
    // fxaaEffectOptions!: FXAAEffectOptions;
    effectPass!: EffectPass;

    effects: Effect[] = [];
    /**
     * 是否启用后处理
     * @private
     */
    #enabled: boolean = false

    constructor(options: IPostProcessingOptions) {
        super(options);
        const renderer = this.viewer.renderManager.defaultWebGLRenderer;
        this.composer = new EffectComposer(renderer, {
            frameBufferType: HalfFloatType
        });
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // this.eventManager.renderSubject.subscribe((timestamp) => {
        //     if (this.#enabled) {
        //         console.log("`1111111111111111")
        //         this.composer.render(timestamp)
        //     }
        // })
    }

    render(timestamp: number) {
        if (this.#enabled) {
            this.composer.render()
        }
    }

    get enable() {
        return this.#enabled;
    }

    set enable(enable: boolean) {
        this.#enabled = enable;
    }

    addRenderPass() {
        const scene = this.viewer.scene;
        this.renderPass = new RenderPass(scene, this.viewer.cameraManager.camera);
        this.composer.addPass(this.renderPass);
    }

    //----------------- selectiveBloomEffect -----------------
    initSelectiveBloomEffect(options?: BloomEffectOptions) {
        // const init = () => {
        this.selectiveBloomEffect = new SelectiveBloomEffect(this.viewer.scene, this.viewer.cameraManager.camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0,
            luminanceSmoothing: 0.2,
            intensity: 10,
            radius: 0.34
        });
        // this.selectiveBloomEffect.inverted = true;
        // }
        // if (isNil(this.selectiveBloomEffect)) {
        //     init()
        // } else {
        //     const isUpdate = compareObjects(options, this.selectiveBloomEffectOptions, []);
        //     if (isUpdate) {
        //         init()
        //     } else {
        //
        //     }
        // }
    }

    addSelectiveBloomEffect() {
        this.effects.push(this.selectiveBloomEffect);
    }

    addSelectiveBloomEffectObject(object: any) {
        return this.selectiveBloomEffect.selection.toggle(object);
    }

    //------------------------------
    kawaseBlurPass: KawaseBlurPass | undefined;

    initBlurEffect(options: any = {}) {
        this.kawaseBlurPass = new KawaseBlurPass({
            height: 480
        });
        this.composer.addPass(this.kawaseBlurPass);
    }

    disposeBlurEffect() {
        if (this.kawaseBlurPass) {
            this.composer.removePass(this.kawaseBlurPass);
            this.kawaseBlurPass.dispose();
        }
    }

    //----------------- outlineEffect -----------------
    outlineEffect: OutlineEffect | undefined;
    outlinePass: EffectPass | undefined;

    initOutlineEffect(options: any = {}) {
        const renderer = this.composer.getRenderer();
        this.outlineEffect = new OutlineEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.SCREEN,
            multisampling: Math.min(4, renderer.capabilities.maxSamples),
            edgeStrength: 2.5,
            pulseSpeed: 0.0,
            visibleEdgeColor: 0xffffff,
            hiddenEdgeColor: 0x22090a,
            height: 480,
            blur: false,
            xRay: true,
            ...options
        });
        this.outlinePass = new EffectPass(this.camera, this.outlineEffect);
        this.composer.addPass(this.outlinePass);
    }

    disposeOutlineEffect() {
        if (this.outlinePass) {
            this.composer.removePass(this.outlinePass);
            this.outlinePass.dispose();
        }
        if (this.outlineEffect) {
            this.outlineEffect.dispose();
        }
    }

    /**
     * 是否包含描边对象
     * @param object
     */
    objectHasOutline(object: Object3D) {
        if (this.outlineEffect) {
            return this.outlineEffect.selection.has(object);
        }
        return false;
    }

    /**
     * 添加描边对象
     * @param object
     */
    addOutlineObject(object: Object3D) {
        if (this.outlineEffect) {
            if (isGroup(object)) {
                this.outlineEffect.selection.add(object);
                object.traverse((child) => {
                    if (isMesh(child)) {
                        this.outlineEffect?.selection.add(child);
                    }
                })
            } else {
                this.outlineEffect.selection.add(object);
            }
        }
    }

    /**
     * 移除描边对象
     * @param object
     */
    removeOutlineObject(object: Object3D) {
        if (this.outlineEffect) {
            if (isGroup(object)) {
                this.outlineEffect.selection.delete(object);
                object.traverse((child) => {
                    if (isMesh(child)) {
                        this.outlineEffect?.selection.delete(child);
                    }
                })
            } else {
                this.outlineEffect.selection.delete(object);
            }
        }
    }

    //----------------- pixelationEffect -----------------


    initPixelationEffect(granularity?: number) {
        this.pixelationEffect = new PixelationEffect(granularity);
    }

    addPixelationEffect() {
        this.effects.push(this.pixelationEffect);
    }

    //----------------- smaaEffect -----------------
    initBloomEffect(options?: BloomEffectOptions) {
        const _options = deepMergeRetain({
            blendFunction: BlendFunction.ADD,  // 混合函数
            luminanceThreshold: 0.1,                // 亮度阈值
            luminanceSmoothing: 0.2,              // 亮度平滑度
            mipmapBlur: true,                      // 是否启用 MIP 模糊
            intensity: 10.0,                         // 辉光强度
            radius: 0.34,                           // 模糊半径
            levels: 8,                              // MIP 级别数量
        }, options);

        this.bloomEffect = new BloomEffect(_options);
    }

    addBloomEffect() {
        this.effects.push(this.bloomEffect);
    }

    //----------------- gridEffect -----------------
    initGridEffect(options: {
        blendFunction?: BlendFunction;
        scale?: number;
        lineWidth?: number;
    }) {
        this.gridEffect = new GridEffect(options);
    }

    //----------------- smaaEffect -----------------
    initSMAAEffect(options: {
        preset?: SMAAPreset;
        edgeDetectionMode?: EdgeDetectionMode;
        predicationMode?: PredicationMode;
    }) {
        this.smaaEffect = new SMAAEffect(options);
    }

    addSMAAEffect() {
        this.effects.push(this.smaaEffect);
    }

    //----------------- ssaoEffect -----------------
    initSSAOEffect(options: any) {
        this.ssaoEffect = new SSAOEffect(options);
    }

    addSSAOEffect() {
        this.effects.push(this.ssaoEffect);
    }

    //----------------- fxaaEffect -----------------
    initFXAAEffect(options: {
        blendFunction?: BlendFunction
    }) {
        this.fxaaEffect = new FXAAEffect(options);
    }

    addFXAAEffect() {
        this.effects.push(this.fxaaEffect);
    }

    //----------------- effectPass -----------------
    initEffectPass() {

        this.effectPass = new EffectPass(this.viewer.cameraManager.camera, ...this.effects);
    }

    addEffectPass() {
        if (this.effectPass) {
            this.composer.addPass(this.effectPass);
        }
    }

    //----------------- setSize -----------------
    setSize(width: number, height: number) {
        this.composer.setSize(width, height);
        // this.selectiveBloomEffect?.setSize(width, height);
        // 
    }
}