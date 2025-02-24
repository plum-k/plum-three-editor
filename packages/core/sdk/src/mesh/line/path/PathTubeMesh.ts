import {Mesh, MeshBasicMaterial, MeshBasicMaterialParameters} from "three";
import {PathPointList, PathTubeGeometry, PathTubeGeometryOptions} from "three.path";
import {ISetPathPointListOptions} from "./PathMesh";


export interface IPathTubePointListOptions extends PathTubeGeometryOptions {
    generateUv2?: boolean
}

export interface IPathTubeOptions {
    pathPointListParams: ISetPathPointListOptions;
    pathTubeGeometryParams: IPathTubePointListOptions;
    meshBasicMaterialParams?: MeshBasicMaterialParameters
}

export class PathTubeMesh extends Mesh<PathTubeGeometry> {

    pathPointList: PathPointList = new PathPointList();

    constructor(_options: IPathTubeOptions) {
        super();
        const {pathPointListParams, pathTubeGeometryParams, meshBasicMaterialParams} = _options;
        this.setPathPointList(pathPointListParams);
        this.geometry = new PathTubeGeometry({
            pathPointList: this.pathPointList,
            options: pathTubeGeometryParams,
        }, pathTubeGeometryParams.generateUv2);

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

