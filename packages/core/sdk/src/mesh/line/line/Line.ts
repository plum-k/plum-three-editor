import * as THREE from "three";
import {isNil} from "lodash-es";
import {LineDashedMaterialParameters} from "three/src/materials/LineDashedMaterial";
import deepMergeRetain from "../../../../../../libs/tool/src/core/deepMergeRetain";
import {isColor} from "three-is";
import {ThreeTool} from "../../../tool";

export enum LineType {
    Line = "Line",
    LineLoop = "LineLoop",
    LineSegments = "LineSegments"
}

export enum LineMaterialType {
    LineBasicMaterial = "LineBasicMaterial",
    LineDashedMaterial = "LineDashedMaterial",
}

export interface ILineOptions {
    points?: Array<THREE.Vector3> | Array<[number, number, number]>;
    vertexColors?: Array<THREE.Color | [number, number, number] | [number, number, number, number]>
    lineType?: LineType;
    materialType?: LineMaterialType;
    materialParams?: LineDashedMaterialParameters,
    // 避免子类的属性没有初始化
    isDelayInit?: boolean
}

export const LineDefaultsOptions: ILineOptions = {
    points: [],
    vertexColors: [],
    lineType: LineType.Line,
    materialType: LineMaterialType.LineBasicMaterial,
    materialParams: {
        color: 0xffffff,
        scale: 1,
        dashSize: 3,
        gapSize: 1,
    },
    isDelayInit: false
}

export default class Line extends THREE.Object3D {
    line!: THREE.Line | THREE.LineLoop | THREE.LineSegments;
    material!: THREE.LineDashedMaterial | THREE.LineBasicMaterial;
    options: Required<ILineOptions> = LineDefaultsOptions as Required<ILineOptions>;
    isPlumLine = true
    points: Array<THREE.Vector3> = []


    constructor(_options: ILineOptions) {
        super()
        this.options = deepMergeRetain(this.options, _options);
        this.init()
        if (!this.options.isDelayInit) {
            this.update(this.options);
        }
    }

    update(_options: ILineOptions) {
        const {lineType, materialType, points, materialParams} = _options;

        if (isNil(this.line) || lineType !== this.options.lineType) {
            this.clear();
            Reflect.set(this, "line", null)
            this.createLine(_options);
            this.add(this.line)
        }

        if (materialType !== this.options.materialType || isNil(this.material)) {
            this.createMaterial(_options);
        } else {
            !isNil(materialParams) && this.material.setValues(materialParams);
        }
        this.options = deepMergeRetain(this.options, _options);
        this.points = ThreeTool.v3ArrayToVector3Array(this.options.points);

        this.setPoints();
        this.setColors();
        this.line.material = this.material;
    }

    updateAfter() {

    }

    addPoint(point: THREE.Vector3) {
        this.points.push(point);
        this.setPoints(this.points)
    }

    setPoints(points: Array<THREE.Vector3> = this.getLinePoints()) {
        this.line.geometry.setFromPoints(points)
        if (this.options.materialType === LineMaterialType.LineDashedMaterial) {
            this.line.computeLineDistances();
        }
    }

    setColors() {
        let colors = this.options.vertexColors.map(color => {
            return isColor(color) ? color.toArray() : color
        })
        const itemSize = (this.options.vertexColors?.[0] as number[] | undefined)?.length === 4 ? 4 : 3
        this.line.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors.flat(), itemSize))
    }

    protected init() {
    }

    protected getLinePoints() {
        return this.points;
    }

    private createLine(_options: ILineOptions) {
        const {lineType, materialType, points, materialParams} = _options;
        switch (lineType) {
            case LineType.Line:
                this.line = new THREE.Line();
                break
            case LineType.LineLoop:
                this.line = new THREE.LineLoop();
                break;

            case LineType.LineSegments:
                this.line = new THREE.LineSegments();
                break;
        }
    }

    private createMaterial(_options: ILineOptions) {
        const {lineType, materialType, points, materialParams} = _options;
        switch (materialType) {
            case LineMaterialType.LineBasicMaterial:
                this.material = new THREE.LineBasicMaterial(materialParams);
                break
            case LineMaterialType.LineDashedMaterial:
                this.material = new THREE.LineDashedMaterial(materialParams);
                break
        }
    }

}