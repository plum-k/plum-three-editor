import { PathGeometry, PathGeometryOptions, PathPointList } from "three.path";
import * as THREE from "three";
import { LineDashedMaterialParameters } from "three";
import { deepMergeRetain } from "../../../tool";

// 路径点列表选项接口
export interface PathPointListOptions {
    cornerRadius?: number; // 拐角半径
    cornerSplit?: number; // 拐角分割数
    up?: THREE.Vector3 | null; // 上方向向量
    close?: boolean; // 是否闭合路径
}

// 路径选项接口
export interface IPathOptions {
    points?: Array<THREE.Vector3>; // 路径点数组
    materialParams?: LineDashedMaterialParameters; // 材质参数
    pathPointListOptions?: PathPointListOptions; // 路径点列表选项
    pathGeometryOptions?: PathGeometryOptions; // 路径几何体选项
}

// Path 类，继承自 THREE.Mesh
export class Path extends THREE.Mesh {
    declare geometry: PathGeometry; // 声明几何体类型
    declare material: THREE.MeshBasicMaterial; // 声明材质类型
    options: Required<IPathOptions>; // 选项
    points: Array<THREE.Vector3> = []; // 路径点数组
    pathPointList: PathPointList; // 路径点列表实例

    // 构造函数
    constructor(_options: IPathOptions) {
        super(); // 调用父类构造函数

        // 合并传入选项与默认选项
        this.options = deepMergeRetain(_options, {
            points: [], // 默认路径点为空
            materialParams: {}, // 默认材质参数为空
            pathGeometryOptions: {
                width: 0.2 // 默认几何体宽度
            }
        });

        const { points, materialParams } = this.options; // 解构选项
        this.points = points; // 设置路径点
        const up = new THREE.Vector3(0, 1, 0); // 定义上方向向量

        // 创建路径点列表
        this.pathPointList = new PathPointList();
        this.pathPointList.set(this.points, 0.3, 10, up, true); // 初始化路径点列表

        this.geometry = new PathGeometry(); // 创建几何体实例
        this.material = new THREE.MeshBasicMaterial(materialParams); // 创建材质实例
    }

    // 添加路径点
    addPoint(point: THREE.Vector3) {
        this.points.push(point); // 将新点添加到路径点数组
        this.setPoints(this.points); // 更新几何体的路径点
    }

    // 设置路径点列表
    setPathPointList(pathPointListOptions?: PathPointListOptions) {
        this.options.pathPointListOptions = pathPointListOptions; // 更新路径点列表选项
        const { cornerRadius, cornerSplit, close, up } = this.options.pathPointListOptions; // 解构选项
        this.pathPointList.set(this.points, cornerRadius, cornerSplit, up, close); // 更新路径点列表
    }

    // 设置路径点
    setPoints(points: Array<THREE.Vector3>) {
        this.geometry.update(this.pathPointList, this.options.pathGeometryOptions); // 更新几何体
    }
}