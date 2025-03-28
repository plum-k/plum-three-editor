import {MeshBasicMaterial, MeshBasicMaterialParameters} from "three";
import {PathTubeGeometry, PathTubeGeometryOptions} from "three.path";
import {IPathOptions, Path} from "./Path";
import {defaults} from "lodash-es";

// 路径管道网格选项接口
export interface IPathTubeMeshOptions extends IPathOptions {
    pathTubeGeometryParams?: PathTubeGeometryOptions; // 路径管道几何体参数
    generateUv2?: boolean; // 是否生成 UV2
    meshBasicMaterialParams?: MeshBasicMaterialParameters; // 材质参数
}

// PathTubeMesh 类，继承自 Mesh
export class PathTubeMesh extends Path {
    pathTubeGeometryParams: Required<PathTubeGeometryOptions> = {
        radius: 0.1,
        radialSegments: 8,
        progress: 1,
        startRad: 0
    }

    set progress(value: number) {
        this.pathTubeGeometryParams.progress = value;
    }

    get progress() {
        return this.pathTubeGeometryParams.progress!;
    }

    constructor(_options: IPathTubeMeshOptions) {
        super(_options); // 调用父类构造函数
        const {
            pathPointListParams
            , pathTubeGeometryParams
            , meshBasicMaterialParams,
            generateUv2,
        } = _options; // 解构选项

        if (pathTubeGeometryParams) {
            this.pathTubeGeometryParams = defaults({
                radius: 0.1,
                radialSegments: 8,
                progress: 1,
                startRad: 0
            }, pathTubeGeometryParams);
        }

        // 设置路径点列表
        this.setPathPointList(pathPointListParams);

        // 创建路径管道几何体
        this.geometry = new PathTubeGeometry({
            pathPointList: this.pathPointList, // 使用路径点列表
            options: pathTubeGeometryParams, // 传入几何体选项
        }, generateUv2 ?? false); // 是否生成 UV2

        // 创建基础材质
        this.material = new MeshBasicMaterial({
            color: 0x58DEDE, // 默认颜色
            depthWrite: true, // 开启深度写入
            transparent: true, // 允许透明度
            opacity: 1, // 默认不透明
            ...meshBasicMaterialParams // 合并传入的材质参数
        });
    }

    // 设置路径点
    geometryUpdate(options?: PathTubeGeometryOptions) {
        this.geometry.update(this.pathPointList, options); // 更新几何体
    }

    tickGeometryUpdate() {
        this.geometry.update(this.pathPointList, this.pathTubeGeometryParams);
    }
}