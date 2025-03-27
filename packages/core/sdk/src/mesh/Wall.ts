import {
    CatmullRomCurve3,
    CurveType,
    ExtrudeGeometry,
    ExtrudeGeometryOptions,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    Shape,
    Vector2,
    Vector3
} from "three";
import {Tool, V3Array} from "../tool";

// 定义墙体选项接口
export interface IWallOption {
    width: number; // 墙体宽度
    height: number; // 墙体高度
    path: {
        points: V3Array; // 路径点数组
        closed?: boolean; // 是否闭合路径
        curveType?: CurveType; // 曲线类型
        tension?: number; // 张力
    },
    extrudeGeometryOptions?: ExtrudeGeometryOptions; // 拉伸几何体选项
}

// Wall 类，继承自 Object3D
export class Wall extends Object3D {
    points: Array<Vector3>; // 存储路径点
    geometry: ExtrudeGeometry; // 拉伸几何体
    material: MeshStandardMaterial; // 材质
    mesh: Mesh; // 网格对象


    constructor(options: IWallOption) {
        super(); // 调用父类构造函数
        const {width, height, path, extrudeGeometryOptions} = options; // 解构选项
        const {closed, curveType, tension, points} = path; // 解构路径选项

        // 创建墙体的形状
        const pts2 = [];
        pts2.push(new Vector2(0, width)); // 右上角
        pts2.push(new Vector2(-height, width)); // 左上角
        pts2.push(new Vector2(-height, 0)); // 左下角
        pts2.push(new Vector2(0, 0)); // 右下角

        const shape = new Shape(pts2); // 创建形状

        // 转换路径点数组
        this.points = Tool.v3ArrayToVector3Array(points);

        // 创建 Catmull-Rom 曲线
        const curve = new CatmullRomCurve3(this.points, closed, curveType, tension);
        curve.arcLengthDivisions = 1000; // 设置弧长分割数

        // 设置拉伸几何体的参数
        const extrudeSettings = {
            steps: this.points.length * 100, // 步数
            bevelEnabled: false, // 禁用斜角
            extrudePath: curve, // 设置拉伸路径
            ...extrudeGeometryOptions // 合并额外的几何体选项
        };

        // 创建拉伸几何体
        this.geometry = new ExtrudeGeometry(shape, extrudeSettings);

        // 创建标准材质
        this.material = new MeshStandardMaterial();

        // 创建网格对象
        this.mesh = new Mesh(this.geometry, this.material);
    }
}