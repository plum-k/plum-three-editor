import {MeshBasicMaterial, MeshBasicMaterialParameters, Usage} from "three";
import {PathGeometry, PathGeometryOptions, PathTubeGeometryOptions} from "three.path";
import {StaticDrawUsage} from "three/src/constants";
import {IPathOptions, Path} from "./Path";
import {defaults} from "lodash-es";

// 路径网格选项接口
export interface IPathMeshOptions extends IPathOptions {
    usage?: Usage; // 几何体使用方式
    generateUv2?: boolean; // 是否生成 UV2
    pathGeometryOptions?: PathGeometryOptions; // 路径几何体参数
    meshBasicMaterialParams?: MeshBasicMaterialParameters; // 材质参数
}
// PathMesh 类，继承自 Mesh
export class PathMesh extends Path {
    pathGeometryOptions: Required<PathGeometryOptions> = {
        width: 0.1,
        progress: 1,
        arrow: true,
        side: 'both'
    }
    constructor(_options: IPathMeshOptions) {
        super(_options); // 调用父类构造函数
        const {
            pathPointListParams, pathGeometryOptions, meshBasicMaterialParams,
            usage,
            generateUv2
        } = _options;
        if (pathGeometryOptions) {
            this.pathGeometryOptions = defaults({
                width: 0.1,
                progress: 1,
                arrow: true,
                side: 'both'
            }, pathGeometryOptions);
        }

        // 设置路径点列表
        this.setPathPointList(pathPointListParams);

        // 创建几何体
        this.geometry = new PathGeometry({
            pathPointList: this.pathPointList, // 指定路径点列表
            options: pathGeometryOptions, // 传入几何体选项
            usage: usage ?? StaticDrawUsage // 设置几何体使用方式
        }, generateUv2 ?? false); // 生成 UV2

        // 创建材质
        this.material = new MeshBasicMaterial({
            color: 0x58DEDE, // 默认颜色
            depthWrite: true, // 开启深度写入
            transparent: true, // 允许透明度
            opacity: 1, // 默认不透明
            ...meshBasicMaterialParams // 合并传入的材质参数
        });
    }
    tickGeometryUpdate() {
        this.geometry.update(this.pathPointList, this.pathGeometryOptions);
    }
    // 设置路径点
    geometryUpdate(options?: PathGeometryOptions) {
        this.geometry.update(this.pathPointList, options); // 更新几何体
    }
}