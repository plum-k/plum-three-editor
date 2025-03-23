
import {Object3D} from "three";
import Heatmap from "heatmap";
import HeatmapInstance, {DataPoint, HeatmapConfig} from "heatmap";
import {deepMergeRetain, Tool} from "../../tool";

export interface IHeatMap2dMeshSetDataOptions {
    max: number;
    min: number;
    data: Array<DataPoint>
}

export interface IHeatMap2dMeshOptions {
    style: HeatmapConfig;
    heatMapData: IHeatMap2dMeshSetDataOptions;
}

const DefaultHeatmap2dMeshOptions: Partial<IHeatMap2dMeshOptions> = {}

export class HeatMap2dMesh extends Object3D {

    heatmap!: HeatmapInstance;

    options: Required<IHeatMap2dMeshOptions> = DefaultHeatmap2dMeshOptions as Required<IHeatMap2dMeshOptions>;

    constructor(_options: IHeatMap2dMeshOptions) {
        super();
        this.options = deepMergeRetain(this.options, _options);
        this.setConfig(_options.style);
    }

    setConfig(config: HeatmapConfig) {
        this.heatmap.configure(config);
    }

    setData(options: IHeatMap2dMeshSetDataOptions) {
        let {max, min, data} = options;
        const {style} = this.options;
        let {radius} = style;
        radius = radius ?? 40;
        const v3Array = data.map(d => {
            return new Vector3(d.x, 0, d.y)
        });

        const box3 = Tool.getBox3ByV3Array(v3Array);


        let minValue = Number.MAX_SAFE_INTEGER
        let maxValue = Number.MIN_SAFE_INTEGER;

        // 偏移下点, 让点都在 大于 0
        let offsetPoints: Array<DataPoint> = []
        // x -> x
        // z -> y

        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            let minx = box3.min.x;
            let minz = box3.min.z;
            offsetPoints.push({
                // "x": d.x - minx,
                // "y": d.y - minz,
                "x": Math.floor(d.x - minx + radius),
                "y": Math.floor(d.y - minz + radius),
                "value": d.value
            })

            minValue = Math.min(minValue, d.value);
            maxValue = Math.max(maxValue, d.value);
        }

        this.heatmap = new Heatmap(style);
        this.heatmap.setData({
            data: offsetPoints,
            min: min ?? minValue,
            max: max ?? maxValue
        });
        this.buildMesh(box3, radius);
    }

    buildMesh(box3: Box3, radius: number) {
        const size = box3.getSize(new Vector3());
        const center = box3.getCenter(new Vector3());

        let _width = size.x + radius * 2;
        let _height = size.z + radius * 2;


        // @ts-ignore
        let canvas = this.heatmap._renderer.canvas
        const geometry = new PlaneGeometry(_width, _height);
        const material = new MeshBasicMaterial();
        material.map = canvas ? new CanvasTexture(canvas) : null;
        const plane = new Mesh(geometry, material);
        this.add(plane);
        this.position.copy(center)
    }
}

