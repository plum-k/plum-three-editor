import { PathPointList, PathTubeGeometry, PathTubeGeometryOptions } from "three.path";

import { LineDashedMaterialParameters } from "three";
import { deepMergeRetain } from "../tool";
import { PathPointListOptions } from "./line/path/Path";
import {Vector3,Mesh,MeshBasicMaterial} from "three";
// 路径管道选项接口
export interface IPathTubeOptions {
    points?: Array<Vector3>; // 路径点数组
    materialParams?: LineDashedMaterialParameters; // 材质参数
    pathPointListOptions?: PathPointListOptions; // 路径点列表选项
    pathTubeGeometryOptions?: PathTubeGeometryOptions; // 路径管道几何体选项
}

// PathTube 类，继承自 Mesh
export class PathTube extends Mesh {
    declare geometry: PathTubeGeometry; // 声明几何体类型
    declare material: MeshBasicMaterial; // 声明材质类型
    options: Required<IPathTubeOptions>; // 选项
    points: Array<Vector3> = []; // 路径点数组
    pathPointList: PathPointList; // 路径点列表实例

    // 构造函数
    constructor(_options: IPathTubeOptions) {
        super(); // 调用父类构造函数

        // 合并传入选项与默认选项
        this.options = deepMergeRetain(_options, {
            points: [], // 默认路径点为空
            materialParams: {}, // 默认材质参数为空
            pathTubeGeometryOptions: {
                width: 0.2 // 默认几何体宽度
            }
        });

        const { points, materialParams } = this.options; // 解构选项
        this.points = points; // 设置路径点
        const up = new Vector3(0, 1, 0); // 定义上方向向量

        // 创建路径点列表
        this.pathPointList = new PathPointList();

        // 设置路径点列表
        this.setPathPointList(this.options.pathPointListOptions, true);
        // 初始化路径点列表
        this.pathPointList.set(this.points, 0.3, 10, up, true);

        // 创建路径管道几何体
        this.geometry = new PathTubeGeometry(
            this.pathPointList, // 使用路径点列表
            this.options.pathTubeGeometryOptions // 传入几何体选项
        );

        // 创建材质
        this.material = new MeshBasicMaterial(materialParams); // 创建材质实例
    }

    // 添加路径点
    addPoint(point: Vector3) {
        this.points.push(point); // 将新点添加到路径点数组
        this.setPoints(this.points); // 更新几何体的路径点
    }

    // 设置路径点列表
    setPathPointList(pathPointListOptions: Partial<PathPointListOptions>, inside = false) {
        if (!inside) {
            this.options.pathPointListOptions = pathPointListOptions; // 更新路径点列表选项
        }

        const { cornerRadius, cornerSplit, close, up } = this.options.pathPointListOptions; // 解构选项
        // 更新路径点列表
        this.pathPointList.set(this.points, cornerRadius, cornerSplit, up, close);
    }

    // 设置路径点
    setPoints(points: Array<Vector3>) {
        // 更新几何体
        this.geometry.update(this.pathPointList, this.options.pathTubeGeometryOptions);
    }
}