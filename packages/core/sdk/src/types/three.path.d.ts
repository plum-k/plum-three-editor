declare module 'three.path' {
    import {BufferGeometry, Usage, Vector3} from "three";

    /**
     * PathPoint
     */
    export declare class PathPoint {
        pos: Vector3;
        dir: Vector3;
        right: Vector3;
        up: Vector3; // normal
        dist: number; // distance from start
        widthScale: number; // for corner
        sharp: boolean; // marks as sharp corner

        constructor();

        lerpPathPoints(p1: PathPoint, p2: PathPoint, alpha: number): void;

        copy(source: PathPoint): void;
    }

    /**
     * PathPointList
     * Input points to generate a PathPoint list
     */
    export declare class PathPointList {
        array: PathPoint[];
        count: number;

        constructor();

        /**
         * Set points
         * @param {Vector3[]} points - Key points array
         * @param {number} [cornerRadius=0.1] - The corner radius. Set 0 to disable round corners.
         * @param {number} [cornerSplit=10] - The corner split.
         * @param {Vector3 | null} [up=null] - Force up direction.
         * @param {boolean} [close=false] - Close path.
         */
        set(points: Vector3[], cornerRadius?: number, cornerSplit?: number, up?: Vector3 | null, close?: boolean): void;

        /**
         * Get distance of this path
         * @return {number} - The distance of the path.
         */
        distance(): number;

        private _getByIndex(index: number): PathPoint;

        private _start(current: Vector3, next: Vector3, up: Vector3 | null): void;

        private _end(current: Vector3): void;

        private _corner(current: Vector3, next: Vector3, cornerRadius: number, cornerSplit: number, up: Vector3 | null): void;

        private _sharpCorner(current: Vector3, next: Vector3, up: Vector3 | null, dirType?: number, sharp?: boolean): void;
    }

    /**
     * PathGeometry
     */
    export declare class PathGeometry extends BufferGeometry {
        constructor(initData?: number | {
            pathPointList: PathPointList;
            options?: PathGeometryOptions;
            usage?: Usage
        }, generateUv2?: boolean);

        update(pathPointList: PathPointList, options?: PathGeometryOptions): void;

        private _initByMaxVertex(maxVertex: number, generateUv2: boolean): void;

        private _initByData(pathPointList: PathPointList, options?: PathGeometryOptions, usage?: Usage, generateUv2?: boolean): void;

        private _resizeAttribute(name: string, len: number): void;

        private _resizeIndex(len: number): void;

        private _updateAttributes(position: number[], normal: number[], uv: number[], uv2?: number[] | null, indices: number[]): void;
    }

    /**
     * Options for PathGeometry
     */
    export interface PathGeometryOptions {
        width?: number; // default is 0.1
        progress?: number; // default is 1
        arrow?: boolean; // default is true
        side?: 'left' | 'right' | 'both'; // default is 'both'
    }

    /**
     * Vertex Data Generate Functions
     */
    export declare function generatePathVertexData(pathPointList: PathPointList, options: PathGeometryOptions, generateUv2?: boolean): {
        position: number[];
        normal: number[];
        uv: number[];
        uv2?: number[] | undefined;
        indices: number[];
        count: number;
    };


    /**
     * PathTubeGeometry
     */
    export declare class PathTubeGeometry extends PathGeometry {
        /**
         * @param {Object|Number} initData - If initData is number, geometry init by empty data and set it as the max vertex. If initData is Object, it contains pathPointList and options.
         * @param {Boolean} [generateUv2=false]
         */
        constructor(initData?: number | {
            pathPointList: PathPointList;
            options?: PathTubeGeometryOptions
        }, generateUv2?: boolean);

        /**
         * Update geometry by PathPointList instance
         * @param {PathPointList} pathPointList
         * @param {Object} options
         * @param {Number} [options.radius=0.1]
         * @param {Number} [options.progress=1]
         * @param {Boolean} [options.radialSegments=8]
         * @param {String} [options.startRad=0]
         */
        update(pathPointList: PathPointList, options?: PathTubeGeometryOptions): void;

        private _initByData(pathPointList: PathPointList, options?: {
            usage?: DrawUsage
        }, usage?: DrawUsage, generateUv2?: boolean): void;
    }

    /**
     * Options for PathTubeGeometry
     */
    export interface PathTubeGeometryOptions {
        radius?: number; // default is 0.1
        progress?: number; // default is 1
        radialSegments?: number; // default is 8
        startRad?: number; // default is 0
    }

    /**
     * Vertex Data Generate Functions
     */
    export declare function generateTubeVertexData(pathPointList: PathPointList, options: PathTubeGeometryOptions, generateUv2?: boolean): {
        position: number[];
        normal: number[];
        uv: number[];
        uv2?: number[];
        indices: number[];
        count: number;
    };

}
