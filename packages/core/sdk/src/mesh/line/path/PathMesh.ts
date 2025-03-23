import { Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, Usage, Vector3 } from "three";
import { PathGeometry, PathGeometryOptions, PathPointList } from "three.path";

// 设置路径点列表选项接口
export interface ISetPathPointListOptions {
    points: Array<Vector3>; // 路径点数组
    cornerRadius?: number; // 拐角半径
    cornerSplit?: number; // 拐角分割数
    up?: Vector3 | null; // 上方向向量
    close?: boolean; // 是否闭合路径
}

// 路径点列表选项接口，继承自 PathGeometryOptions
export interface IPathPointListOptions extends PathGeometryOptions {
    usage?: Usage; // 几何体使用方式
    generateUv2?: boolean; // 是否生成 UV2
}

// 路径网格选项接口
export interface IPathMeshOptions {
    pathPointListParams: ISetPathPointListOptions; // 路径点列表参数
    pathGeometryParams: IPathPointListOptions; // 路径几何体参数
    meshBasicMaterialParams?: MeshBasicMaterialParameters; // 材质参数
}

// PathMesh 类，继承自 Mesh
export class PathMesh extends Mesh<PathGeometry> {

    pathPointList: PathPointList = new PathPointList(); // 路径点列表实例

    // 构造函数
    constructor(_options: IPathMeshOptions) {
        super(); // 调用父类构造函数
        const { pathPointListParams, pathGeometryParams, meshBasicMaterialParams } = _options;

        // 设置路径点列表
        this.setPathPointList(pathPointListParams);

        // 创建几何体
        this.geometry = new PathGeometry({
            pathPointList: this.pathPointList, // 指定路径点列表
            options: pathGeometryParams, // 传入几何体选项
            usage: pathGeometryParams.usage // 设置几何体使用方式
        }, pathGeometryParams.generateUv2); // 生成 UV2

        // 创建材质
        this.material = new MeshBasicMaterial({
            color: 0x58DEDE, // 默认颜色
            depthWrite: true, // 开启深度写入
            transparent: true, // 允许透明度
            opacity: 1, // 默认不透明
            ...meshBasicMaterialParams // 合并传入的材质参数
        });
    }

    // 设置路径点列表
    setPathPointList(options: ISetPathPointListOptions) {
        this.pathPointList.set(options.points, options.cornerRadius, options.cornerSplit, options.up, options.close); // 设置路径点
    }
}