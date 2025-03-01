import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass";
import {IModuleOptions } from "../../core/Module";
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
    OutlineEffect,
    PixelationEffect,
    PredicationMode,
    RenderPass,
    SelectiveBloomEffect,
    SMAAEffect,
    SMAAPreset,
    SSAOEffect,
} from "postprocessing";
import {HalfFloatType} from "three";
import {Object3D} from "three/src/core/Object3D";
import {Module} from "../../core";

export interface IPostProcessingOptions extends IModuleOptions  {
}

export class PostProcessingManager extends Module {
    // @ts-ignore
    pixelationEffect: PixelationEffect;

    composer: EffectComposer;
    renderPass!: RenderPass;
    outputPass!: OutputPass;

    selectiveBloomEffect!: SelectiveBloomEffect;
    bloomEffect!: BloomEffect;
    gridEffect!: GridEffect;
    outlineEffect!: OutlineEffect;
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

    constructor(options: IPostProcessingOptions) {
        super(options);
        const renderer = this.viewer.renderManager.defaultWebGLRenderer;
        this.composer = new EffectComposer(renderer, {
            frameBufferType: HalfFloatType
        });

        this.eventManager.renderSubject.subscribe(() => {
            this.composer.render()
        })
    }

    addRenderPass() {
        const scene = this.viewer.scene;
        this.renderPass = new RenderPass(scene, this.viewer.threeCameraControls.camera);
        this.composer.addPass(this.renderPass);
    }

    //----------------- selectiveBloomEffect -----------------
    initSelectiveBloomEffect(options?: BloomEffectOptions) {
        // const init = () => {
        this.selectiveBloomEffect = new SelectiveBloomEffect(this.viewer.scene, this.viewer.threeCameraControls.camera, {
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

    //----------------- outlineEffect -----------------
    initOutlineEffect(options: any) {
        const renderer = this.composer.getRenderer();
        this.outlineEffect = new OutlineEffect(this.viewer.scene, this.viewer.threeCameraControls.camera, {
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
    }

    addOutlineEffect() {
        this.effects.push(this.outlineEffect);
    }

    outlineEffectObject(object: Object3D) {
        return this.outlineEffect.selection.toggle(object);
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
        
        this.effectPass = new EffectPass(this.viewer.threeCameraControls.camera, ...this.effects);
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