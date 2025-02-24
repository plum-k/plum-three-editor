import {PathGeometry, PathGeometryOptions, PathPointList} from "three.path";
import * as THREE from "three";
import {LineDashedMaterialParameters} from "three/src/materials/LineDashedMaterial";
import {deepMergeRetain} from "../tool";


export interface PathPointListOptions {
    cornerRadius?: number;
    cornerSplit?: number;
    up?: THREE.Vector3 | null;
    close?: boolean;
}

export interface IPathOptions {
    points?: Array<THREE.Vector3>;
    materialParams?: LineDashedMaterialParameters
    pathPointListOptions?: PathPointListOptions
    pathGeometryOptions?: PathGeometryOptions
}

export class Path extends THREE.Mesh {
    declare geometry: PathGeometry;
    declare material: THREE.MeshBasicMaterial;
    options: Required<IPathOptions>;
    points: Array<THREE.Vector3> = [];
    pathPointList: PathPointList

    constructor(_options: IPathOptions) {
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
        this.pathPointList.set(this.points, 0.3, 10, up, true);

        this.geometry = new PathGeometry();

        this.material = new THREE.MeshBasicMaterial(materialParams);
    }

    addPoint(point: THREE.Vector3) {
        this.points.push(point);
        this.setPoints(this.points)
    }

    setPathPointList(pathPointListOptions?: PathPointListOptions) {
        this.options.pathPointListOptions = pathPointListOptions;
        const {cornerRadius, cornerSplit, close, up} = this.options.pathPointListOptions;
        this.pathPointList.set(this.points, cornerRadius, cornerSplit, up, close);
    }

    setPoints(points: Array<THREE.Vector3>) {
        this.geometry.update(this.pathPointList, this.options.pathGeometryOptions);
    }
}