import {PathPointList, PathTubeGeometry, PathTubeGeometryOptions} from "three.path";
import * as THREE from "three";
import {LineDashedMaterialParameters} from "three";
import {deepMergeRetain} from "../tool";
import {PathPointListOptions} from "./Path";


export interface IPathTubeOptions {
    points?: Array<THREE.Vector3>;
    materialParams?: LineDashedMaterialParameters
    pathPointListOptions?: PathPointListOptions
    pathTubeGeometryOptions?: PathTubeGeometryOptions
}

export class PathTube extends THREE.Mesh {
    declare geometry: PathTubeGeometry;
    declare material: THREE.MeshBasicMaterial;
    options: Required<IPathTubeOptions>;
    points: Array<THREE.Vector3> = [];
    pathPointList: PathPointList

    constructor(_options: IPathTubeOptions) {
        super()
        this.options = deepMergeRetain(_options, {
            points: [],
            materialParams: {},
            pathGeometryOptions: {
                width: 0.2
            }
        });
        const {points, materialParams} = this.options;

        this.points = points;
        const up = new THREE.Vector3(0, 1, 0);

        // create PathPointList
        this.pathPointList = new PathPointList();

        this.setPathPointList(this.options.pathPointListOptions, true)
        // todo
        this.pathPointList.set(this.points, 0.3, 10, up, true);

        this.geometry = new PathTubeGeometry(
            this.pathPointList,
            this.options.pathTubeGeometryOptions
        );

        this.material = new THREE.MeshBasicMaterial(materialParams);
    }

    addPoint(point: THREE.Vector3) {
        this.points.push(point);
        this.setPoints(this.points)
    }

    setPathPointList(pathPointListOptions: Partial<PathPointListOptions>, inside = false) {
        if (!inside) {
            this.options.pathPointListOptions = pathPointListOptions;
        }

        const {cornerRadius, cornerSplit, close, up} = this.options.pathPointListOptions;
        this.pathPointList.set(this.points, cornerRadius, cornerSplit, up, close);
    }

    setPoints(points: Array<THREE.Vector3>) {
        this.geometry.update(this.pathPointList, this.options.pathTubeGeometryOptions);
    }
}