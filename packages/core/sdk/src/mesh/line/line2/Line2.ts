import * as THREE from "three";
import {Object3D} from "three";
import {LineMaterial, LineMaterialParameters} from "three/examples/jsm/lines/LineMaterial";
import {Line2 as THREELine2} from "three/examples/jsm/lines/Line2";
import {LineSegments2} from "three/examples/jsm/lines/LineSegments2";
import {Wireframe} from "three-stdlib";
import {isNil} from "lodash-es";
import {isColor} from "three-is";
import {deepMergeRetain, Tool} from "../../../tool";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {LineSegmentsGeometry} from "three/examples/jsm/lines/LineSegmentsGeometry";

// jsm
export enum Line2Type {
    Line2 = "Line2",
    LineSegments2 = "LineSegments2",
    Wireframe = "Wireframe"
}

export interface ILine2Options {
    points?: Array<THREE.Vector3> | Array<[number, number, number]>;
    vertexColors?: Array<THREE.Color | [number, number, number] | [number, number, number, number]>
    lineType?: Line2Type;
    materialParams?: LineMaterialParameters;
    // 避免子类的属性没有初始化
    isDelayInit?: boolean,
}

export const Line2DefaultsOptions: ILine2Options = {
    points: [],
    vertexColors: [],
    lineType: Line2Type.Line2,
    materialParams: {
        // alphaToCoverage: true,
        // color: "red",
        // dashed: false,
        // worldUnits: false,
        // linewidth: 1,
        // resolution: new THREE.Vector2(1, 1),
        // dashOffset: 0,
        // dashScale: 1,
        // dashSize: 1,
        // gapSize: 1,
    },
    isDelayInit: false
}

export const GeometryMap = {
    "LineGeometry": LineGeometry,
    "LineSegmentsGeometry": LineSegmentsGeometry
}

export class Line2 extends Object3D {
    line!: THREELine2 | LineSegments2 | Wireframe
    material!: LineMaterial;
    options: Required<ILine2Options> = Line2DefaultsOptions as Required<ILine2Options>;
    points: Array<THREE.Vector3> = [];

    constructor(_options: ILine2Options) {
        super()
        this.options = deepMergeRetain(this.options, _options);

        this.init()
        if (!this.options.isDelayInit) {
            this.update(this.options);
        }
    }

    createLine(_options: ILine2Options) {
        const {lineType, points, materialParams} = _options;
        switch (lineType) {
            case Line2Type.Line2:
                this.line = new THREELine2();
                break
            case Line2Type.LineSegments2:
                this.line = new LineSegments2();
                break;
            case Line2Type.Wireframe:
                this.line = new Wireframe();
                break;
        }
    }

    update(_options: ILine2Options) {
        const {lineType, points, materialParams} = _options;
        if (isNil(this.line) || lineType !== this.options.lineType) {
            this.clear();
            Reflect.set(this, "line", null)
            this.createLine(_options);
            this.add(this.line)
        }
        if (isNil(this.material)) {
            this.material = new LineMaterial(materialParams);
        } else {
            !isNil(materialParams) && this.material.setValues(materialParams);
        }

        this.line.material = this.material;

        this.options = deepMergeRetain(this.options, _options);
        this.points = Tool.v3ArrayToVector3Array(this.options.points);
        this.setPoints();
        // this.setColors();
    }

    updateGeometry() {
        this.line.geometry.dispose();
        // @ts-ignore
        const geo = new GeometryMap[this.line.geometry.type];
        this.line.geometry = geo;
    }

    addPoint(point: THREE.Vector3) {
        this.points.push(point);
        this.setPoints(this.points)
    }

    init() {
    }

    setPoints(points: Array<THREE.Vector3> = this.getLinePoints()) {
        this.updateGeometry();
        let pointArray = Tool.v3ArrayToNum3Array(points).flat();
        this.line.geometry?.setPositions(pointArray);
        this.line.computeLineDistances();
    }

    setColors() {
        let colors = this.options.vertexColors.map(color => {
            return isColor(color) ? color.toArray() : color
        })
        const itemSize = (this.options.vertexColors?.[0] as number[] | undefined)?.length === 4 ? 4 : 3
        if (colors.length > 2) {
            this.line.geometry.setColors(colors.flat())
        }
        // this.line.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors.flat(), itemSize))
    }

    protected getLinePoints() {
        return this.points;
    }
}