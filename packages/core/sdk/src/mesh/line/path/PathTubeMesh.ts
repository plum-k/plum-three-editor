import { Mesh, MeshBasicMaterial, MeshBasicMaterialParameters } from "three";
import { PathPointList, PathTubeGeometry, PathTubeGeometryOptions } from "three.path";
import { ISetPathPointListOptions } from "./PathMesh";

// 路径管道点列表选项接口，继承自 PathTubeGeometryOptions
export interface IPathTubePointListOptions extends PathTubeGeometryOptions {
    generateUv2?: boolean; // 是否生成 UV2
}

// 路径管道网格选项接口
export interface IPathTubeMeshOptions {
    pathPointListParams: ISetPathPointListOptions; // 路径点列表参数
    pathTubeGeometryParams: IPathTubePointListOptions; // 路径管道几何体参数
    meshBasicMaterialParams?: MeshBasicMaterialParameters; // 材质参数
}

// PathTubeMesh 类，继承自 THREE.Mesh
export class PathTubeMesh extends Mesh<PathTubeGeometry> {

    pathPointList: PathPointList = new PathPointList(); // 路径点列表实例

    // 构造函数
    constructor(_options: IPathTubeMeshOptions) {
        super(); // 调用父类构造函数
        const { pathPointListParams, pathTubeGeometryParams, meshBasicMaterialParams } = _options; // 解构选项

        // 设置路径点列表
        this.setPathPointList(pathPointListParams);

        // 创建路径管道几何体
        this.geometry = new PathTubeGeometry({
            pathPointList: this.pathPointList, // 使用路径点列表
            options: pathTubeGeometryParams, // 传入几何体选项
        }, pathTubeGeometryParams.generateUv2); // 是否生成 UV2

        // 创建基础材质
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
        // 更新路径点列表
        this.pathPointList.set(options.points, options.cornerRadius, options.cornerSplit, options.up, options.close);
    }
}