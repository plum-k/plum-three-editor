import {CatmullRomCurve3} from "three";
import {ILineOptions, PLine} from "./PLine";

// 定义曲线类型的枚举
export enum CurveType {
    Centripetal = 'centripetal', // 向心曲线
    Chordal = 'chordal',          // 弦曲线
    CatmullRom = 'catmullrom'     // Catmull-Rom 曲线
}

// 定义 CatmullRomLine 选项接口
export interface ICatmullRomLineOptions extends ILineOptions {
    closed?: boolean;            // 是否闭合曲线
    curveType?: CurveType;      // 曲线类型
    tension?: number;           // 张力
    segments?: number;          // 曲线段数
}

// CatmullRomLine 的默认选项
export const CatmullRomLineDefaultsOptions: ICatmullRomLineOptions = {
    closed: false,              // 默认不闭合
    curveType: CurveType.CatmullRom, // 默认使用 Catmull-Rom 曲线
    tension: 0.5,               // 默认张力为 0.5
    segments: 20                // 默认分段数为 20
}

// CatmullRomLine 类，继承自 Line 类
export class CatmullRomLine extends PLine {
    catmullRomCurve3: CatmullRomCurve3 = new CatmullRomCurve3(); // 创建 CatmullRomCurve3 实例
    declare options: Required<ICatmullRomLineOptions>; // 声明选项


    constructor(_options: ICatmullRomLineOptions) {
        super({
            ...CatmullRomLineDefaultsOptions, // 合并默认选项和传入选项
            ..._options,
            isDelayInit: true                // 延迟初始化
        });
        this.update(this.options);          // 更新选项
    }

    // 更新方法
    update(_options: ICatmullRomLineOptions) {
        super.update(_options);            // 调用父类的更新方法
    }

    // 获取曲线点
    getLinePoints() {
        const {points, closed, curveType, tension, segments} = this.options;
        this.catmullRomCurve3.points = this.points; // 设置曲线的控制点
        this.catmullRomCurve3.closed = closed;       // 设置是否闭合
        this.catmullRomCurve3.curveType = curveType; // 设置曲线类型
        this.catmullRomCurve3.tension = tension;     // 设置张力

        // 返回生成的曲线点
        return this.catmullRomCurve3.getPoints(this.options.segments);
    }
}