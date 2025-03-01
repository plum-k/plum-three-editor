import {IMeasureOptions, Measure} from "./Measure";
import * as THREE from "three";
import {Vector3} from "three";
import {IPick} from "../../manager/EventManager";
import {Line2} from "../../mesh/line/line2/Line2";
import {isNil, round} from "lodash-es";
import {TextSprite} from "../../mesh/label/TextSprite";
import {ThreeTool} from "../../tool";

export enum EDistanceMeasureTextModel {
    Segment, // 分段长度
    Total       // 总长度
}

export interface IBaseDistanceMeasureOptions {
    // 点击几次停止测量,-1为无限制
    pointStopNum: number;
    textModel: EDistanceMeasureTextModel;
}

export interface IDistanceMeasureOptions extends IMeasureOptions {
    // 点击几次停止测量,-1为无限制
    pointStopNum: number;
    textModel: EDistanceMeasureTextModel;
}

export class DistanceMeasure extends Measure<IDistanceMeasureOptions> {
    pointGroup = new THREE.Group();
    lineGroup = new THREE.Group();
    textSprite = new THREE.Group();

    points: Array<THREE.Vector3> = [];
    lines = []
    line: Line2 | undefined;
    isEnd = false;

    constructor(options: IDistanceMeasureOptions) {
        super(options);
        this.scene.add(this.pointGroup);
        this.pointGroup.userData.isVisibleGraph = false;
        this.pointGroup.userData.tag = ["DistanceMeasurePointGroup"];
        this.scene.add(this.lineGroup);
        this.lineGroup.userData.isVisibleGraph = false;
        this.lineGroup.userData.tag = ["DistanceMeasureLineGroup"];
        this.scene.add(this.textSprite);
        this.textSprite.userData.isVisibleGraph = false;
        this.textSprite.userData.tag = ["DistanceMeasureLineGroup"];
    }

    isFinish() {
        const {pointStopNum, textModel} = this.options;
        if (this.isEnd) {
            return true;
        }
        if (pointStopNum === -1) {
            return false
        }
        return this.points.length === pointStopNum;
    }

    createSphereMaterial() {
        let meshLambertMaterial = new THREE.MeshLambertMaterial({
                //shading: THREE.SmoothShading,
                color: new THREE.Color("#ff0000"),
                depthTest: false,
                depthWrite: false
            }
        );

        return meshLambertMaterial;
    };

    onAddPointEvent(value: IPick) {
        const {position} = value;
        if (this.isFinish()) {
            return;
        }
        this.points.push(position);
        this.addPoint(position);
        this.addLine(position);
        this.addText();
    }

    addPoint(position: Vector3) {
        // todo 动态计算模型大小
        const sphereGeometry = new THREE.SphereGeometry(0.4, 10, 10);
        let sphere = new THREE.Mesh(sphereGeometry, this.createSphereMaterial());
        sphere.position.copy(position);
        this.pointGroup.add(sphere);
    }

    onMoveEvent(value: IPick) {
        const {position} = value;
        if (isNil(this.line)) return;
        if (this.isFinish()) {
            return;
        }
        const {pointStopNum, textModel} = this.options;
        // 
        // if (this.points.length < pointStopNum) {
        //     return;
        // }
        const points = [...this.points, position];
        // 
        this.line.setPoints(points);
    }

    addLine(position: Vector3) {
        if (isNil(this.line)) {
            this.line = new Line2({
                points: [position, position],
                // points: cc,
                materialParams: {
                    color: 0x00ff00,
                    linewidth: 10,
                }
            })
            this.lineGroup.add(this.line);
        } else {
            this.line.setPoints(this.points);
        }
    }

    addText() {
        const {pointStopNum, textModel} = this.options;
        let len = this.points.length;
        if (len >= 2) {
            const startIndex = len - 2;
            const {text, distance, center} = this.getLabelSegmentInfo(startIndex);
            const textSprite = new TextSprite(text);
            textSprite.material.depthTest = false;
            textSprite.material.depthWrite = false;
            textSprite.position.copy(center);
            this.textSprite.add(textSprite)
        }

    }

    getLabelSegmentInfo(startIndex: number) {
        const {pointStopNum, textModel} = this.options;
        let distance = 0
        if (textModel === EDistanceMeasureTextModel.Segment) {
            distance = this.points[startIndex].distanceTo(this.points[startIndex + 1]);
        } else {
            distance = ThreeTool.calculateTotalLength(this.points)
            // const distance = this.points[startIndex].distanceTo(this.points[startIndex + 1]);
        }
        const center = ThreeTool.calculateCenter(this.points[startIndex], this.points[startIndex + 1]);
        const text = `${round(distance, 2)} 米`;
        return {
            text: text,
            distance: distance,
            center: center
        }
    }

    getLabelTotalInfo() {
        const distance = ThreeTool.calculateTotalLength(this.points)
        const center = ThreeTool.getBox3ByV3Array(this.points).getCenter(new THREE.Vector3());
        const text = `${round(distance, 2)} 米`;
        return {
            text: text,
            distance: distance,
            center: center
        }
    }

    onEndEvent(value: IPick) {
        this.isEnd = true;
    }
}