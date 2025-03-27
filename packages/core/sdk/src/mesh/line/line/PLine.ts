import {isNil} from "lodash-es";
import {isColor} from "three-is";
import {deepMergeRetain, Tool} from "../../../tool";
import {
    Color,
    Float32BufferAttribute,
    Line,
    LineBasicMaterial,
    LineDashedMaterial,
    LineDashedMaterialParameters,
    LineLoop,
    LineSegments,
    Object3D,
    Vector3
} from "three";

// 定义线条类型的枚举
export enum LineType {
    Line = "Line",            // 普通线
    LineLoop = "LineLoop",    // 闭合线
    LineSegments = "LineSegments" // 线段
}

// 定义线材质类型的枚举
export enum LineMaterialType {
    LineBasicMaterial = "LineBasicMaterial",  // 基础材质
    LineDashedMaterial = "LineDashedMaterial", // 虚线材质
}

// 定义线条选项接口
export interface ILineOptions {
    points?: Array<Vector3> | Array<[number, number, number]>; // 线条控制点
    vertexColors?: Array<Color | [number, number, number] | [number, number, number, number]>; // 顶点颜色
    lineType?: LineType; // 线条类型
    materialType?: LineMaterialType; // 材质类型
    materialParams?: LineDashedMaterialParameters; // 材质参数
    isDelayInit?: boolean; // 是否延迟初始化
}

// 线条的默认选项
export const LineDefaultsOptions: ILineOptions = {
    points: [], // 默认控制点为空
    vertexColors: [], // 默认顶点颜色为空
    lineType: LineType.Line, // 默认使用普通线
    materialType: LineMaterialType.LineBasicMaterial, // 默认使用基础材质
    materialParams: {
        color: 0xffffff, // 默认颜色为白色
        scale: 1, // 默认比例为 1
        dashSize: 3, // 默认虚线大小
        gapSize: 1, // 默认虚线间隔
    },
    isDelayInit: false // 默认不延迟初始化
}

// Line 类，继承自 Object3D
export class PLine extends Object3D {
    line!: Line | LineLoop | LineSegments; // 线条对象
    material!: LineDashedMaterial | LineBasicMaterial; // 材质对象
    options: Required<ILineOptions> = LineDefaultsOptions as Required<ILineOptions>; // 选项
    isPlumLine = true; // 是否为梅花线
    points: Array<Vector3> = []; // 控制点数组


    constructor(_options: ILineOptions) {
        super(); // 调用父类构造函数
        this.options = deepMergeRetain(this.options, _options); // 合并默认选项和传入选项
        this.init(); // 初始化
        if (!this.options.isDelayInit) {
            this.update(this.options); // 如果没有延迟初始化，则更新
        }
    }

    // 更新方法
    update(_options: ILineOptions) {
        const {lineType, materialType, points, materialParams} = _options;

        // 检查线条类型是否变化，如果变化则重建线条
        if (isNil(this.line) || lineType !== this.options.lineType) {
            this.clear(); // 清除现有对象
            Reflect.set(this, "line", null); // 重置线条
            this.createLine(_options); // 创建新线条
            this.add(this.line); // 将新线条添加到场景中
        }

        // 检查材质类型是否变化，如果变化则重建材质
        if (materialType !== this.options.materialType || isNil(this.material)) {
            this.createMaterial(_options); // 创建新材质
        } else {
            // 更新材质参数
            !isNil(materialParams) && this.material.setValues(materialParams);
        }

        // 更新选项和控制点
        this.options = deepMergeRetain(this.options, _options);
        this.points = Tool.v3ArrayToVector3Array(this.options.points);

        this.setPoints(); // 设置控制点
        this.setColors(); // 设置颜色
        this.line.material = this.material; // 应用材质
    }

    updateAfter() {
        // 后续更新逻辑（可根据需要实现）
    }

    // 添加控制点
    addPoint(point: Vector3) {
        this.points.push(point); // 将新点添加到控制点数组
        this.setPoints(this.points); // 更新控制点
    }

    // 设置控制点
    setPoints(points: Array<Vector3> = this.getLinePoints()) {
        this.line.geometry.setFromPoints(points); // 设置几何体的控制点
        if (this.options.materialType === LineMaterialType.LineDashedMaterial) {
            this.line.computeLineDistances(); // 计算虚线距离
        }
    }

    // 设置线条颜色
    setColors() {
        let colors = this.options.vertexColors.map(color => {
            return isColor(color) ? color.toArray() : color; // 将颜色转换为数组
        });
        const itemSize = (this.options.vertexColors?.[0] as number[] | undefined)?.length === 4 ? 4 : 3; // 判断颜色数组的大小
        this.line.geometry.setAttribute("color", new Float32BufferAttribute(colors.flat(), itemSize)); // 设置颜色属性
    }

    // 初始化方法
    protected init() {
        // 初始化逻辑（可根据需要实现）
    }

    // 获取控制点
    protected getLinePoints() {
        return this.points; // 返回控制点
    }

    // 创建线条
    private createLine(_options: ILineOptions) {
        const {lineType} = _options;
        switch (lineType) {
            case LineType.Line:
                this.line = new Line(); // 创建普通线
                break;
            case LineType.LineLoop:
                this.line = new LineLoop(); // 创建闭合线
                break;
            case LineType.LineSegments:
                this.line = new LineSegments(); // 创建线段
                break;
        }
    }

    // 创建材质
    private createMaterial(_options: ILineOptions) {
        const {materialType, materialParams} = _options;
        switch (materialType) {
            case LineMaterialType.LineBasicMaterial:
                this.material = new LineBasicMaterial(materialParams); // 创建基础材质
                break;
            case LineMaterialType.LineDashedMaterial:
                this.material = new LineDashedMaterial(materialParams); // 创建虚线材质
                break;
        }
    }
}