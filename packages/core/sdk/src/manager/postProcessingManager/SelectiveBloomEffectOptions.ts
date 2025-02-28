import {BlendFunction, BlurPass, KernelSize, Resizer} from "postprocessing";

export interface SelectiveBloomEffectOptions {
    selection: any[];                 // 选择的对象
    lights: any[];                    // 所有影响效果的灯光
    blendFunction: BlendFunction;     // 混合函数
    width: number;                    // 渲染宽度
    height: number;                   // 渲染高度
    selectionLayer: number;           // 选择层
    blurPass?: BlurPass | null;       // 模糊通道
    kernelSize: KernelSize;           // 模糊内核大小
    luminanceThreshold: number;       // 亮度阈值
    luminanceSmoothing: number;       // 亮度平滑度
    intensity: number;                // 效果强度
}

export const SelectiveBloomEffectOptionsDefault: SelectiveBloomEffectOptions = {
    selection: [],                     // 填入选择的对象
    lights: [],                        // 填入灯光对象
    blendFunction: BlendFunction.SCREEN,
    width: Resizer.AUTO_SIZE,         // 假设 Resizer 是一个已定义的对象
    height: Resizer.AUTO_SIZE,
    selectionLayer: 0,
    blurPass: null,
    kernelSize: KernelSize.LARGE,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.025,
    intensity: 1,
};