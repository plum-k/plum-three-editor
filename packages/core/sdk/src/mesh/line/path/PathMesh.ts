import {Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, Vector3} from "three";
import {PathGeometry, PathGeometryOptions, PathPointList} from "three.path";
import {Usage} from "three/src/constants";

export interface ISetPathPointListOptions {
    points: Array<Vector3>;
    cornerRadius?: number;
    cornerSplit?: number;
    up?: Vector3 | null;
    close?: boolean;
}

export interface IPathPointListOptions extends PathGeometryOptions {
    usage?: Usage;
    generateUv2?: boolean
}

export interface IPathOptions {
    pathPointListParams: ISetPathPointListOptions;
    pathGeometryParams: IPathPointListOptions;
    meshBasicMaterialParams?: MeshBasicMaterialParameters
}

export default class PathMesh extends Mesh<PathGeometry> {

    pathPointList: PathPointList = new PathPointList();

    constructor(_options: IPathOptions) {
        super();
        const {pathPointListParams, pathGeometryParams, meshBasicMaterialParams} = _options;
        this.setPathPointList(pathPointListParams);
        this.geometry = new PathGeometry({
            pathPointList: this.pathPointList,
            options: pathGeometryParams,
            usage: pathGeometryParams.usage // geometry usage
        }, pathGeometryParams.generateUv2);

        this.material = new MeshBasicMaterial({
            color: 0x58DEDE,
            depthWrite: true,
            transparent: true,
            opacity: 1,
            ...meshBasicMaterialParams
        })
    }

    setPathPointList(options: ISetPathPointListOptions) {
        this.pathPointList.set(options.points, options.cornerRadius, options.cornerSplit, options.up, options.close)
    }

}

