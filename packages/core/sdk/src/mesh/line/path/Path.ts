import {PathGeometry, PathPointList, PathTubeGeometry} from "three.path";

import {Mesh, MeshBasicMaterial, Vector3} from "three";
import {Viewer} from "../../../core";
import {Subscription} from "rxjs";

// 设置路径点列表选项接口
export interface ISetPathPointListOptions {
    points: Array<Vector3>; // 路径点数组
    cornerRadius?: number; // 拐角半径
    cornerSplit?: number; // 拐角分割数
    up?: Vector3 | null; // 上方向向量
    close?: boolean; // 是否闭合路径
}

// 路径选项接口
export interface IPathOptions {
    pathPointListParams: ISetPathPointListOptions; // 路径点列表参数
}

// Path 类，继承自 Mesh
export class Path extends Mesh {
    declare material: MeshBasicMaterial; // 声明材质类型
    declare geometry: PathTubeGeometry | PathGeometry; // 声明材质类型
    points: Array<Vector3> = []; // 路径点数组
    pathPointList: PathPointList = new PathPointList(); // 路径点列表实例

    protected constructor(_options: IPathOptions) {
        super();
    }

    // // 添加路径点
    // addPoint(point: Vector3) {
    //     this.points.push(point); // 将新点添加到路径点数组
    //     this.setPoints(this.points); // 更新几何体的路径点
    // }

    // 设置路径点列表
    setPathPointList(options: ISetPathPointListOptions) {
        // 更新路径点列表
        this.pathPointList.set(options.points, options.cornerRadius, options.cornerSplit, options.up, options.close);
    }

    // 设置路径点
    geometryUpdate(options?: unknown) {
    }

    subscription: Subscription | undefined = undefined;

    startTick(viewer: Viewer) {
        this.subscription = viewer.eventManager.renderSubject.subscribe((event) => {
            this.tick(event.delta);
        });
    }

    stopTick() {
        this.subscription?.unsubscribe();
    }

    progressAnimationSpeed = 0.01;

    set progress(value: number) {

    }

    get progress() {
        return 0
    }

    playProgressAnimation = false;

    progressPLay() {
        this.playProgressAnimation = true;
    }

    /**
     * 更新几何体
     */
    tickGeometryUpdate(){}
    progressAnimationTick() {
        const distance = this.pathPointList.distance();
        if (distance > 0) {
            this.progress += this.progressAnimationSpeed / distance;
            if (this.progress > 1) {
                this.playProgressAnimation = false;
                this.progress = 1;
            }
            this.tickGeometryUpdate();
        } else {
            this.playProgressAnimation = false;
            this.progress = 1;
        }
    }
    uvAnimationSpeed = 0.01;
    playUvAnimation = false;
    uvAnimationTick() {
        const texture = this.material.map;
        if (texture) {
            texture.offset.x += this.uvAnimationSpeed;
            texture.repeat.x = 1;
        }
    }
    tick(deltaTime: number) {
        if (this.playProgressAnimation) {
            this.progressAnimationTick();
        }
        if (this.playUvAnimation) {
            this.uvAnimationTick();
        }
    }
}