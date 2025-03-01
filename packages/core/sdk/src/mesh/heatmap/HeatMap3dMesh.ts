import * as THREE from "three";
import Heatmap from "heatmap";
import HeatmapInstance, {DataPoint, HeatmapConfig} from "heatmap";
import {deepMergeRetain, ThreeTool} from "../../tool";
import {Object3D} from "three/src/core/Object3D";

export interface IHeatMap3dMeshSetDataOptions {
    max: number;
    min: number;
    data: Array<DataPoint>
}

export interface IHeatMap3dMeshOptions {
    style: HeatmapConfig;
    heatMapData: IHeatMap3dMeshSetDataOptions;
    zoom: number,
    widthSegments: number,
    heightSegments: number,
}

const DefaultHeatmap3dMeshOptions: Partial<IHeatMap3dMeshOptions> = {
    zoom: 1,
    widthSegments: 100,
    heightSegments: 100,
}

export class HeatMap3dMesh extends Object3D {

    heatmap!: HeatmapInstance;

    options: Required<IHeatMap3dMeshOptions> = DefaultHeatmap3dMeshOptions as Required<IHeatMap3dMeshOptions>;

    constructor(_options: IHeatMap3dMeshOptions) {
        super();
        this.options = deepMergeRetain(this.options, _options);
        this.setConfig(_options.style);
    }

    setConfig(config: HeatmapConfig) {
        this.heatmap.configure(config);
    }

    setData(options: IHeatMap3dMeshSetDataOptions) {
        let {max, min, data} = options;
        const {style} = this.options;
        let {radius} = style;
        radius = radius ?? 40;
        const v3Array = data.map(d => {
            return new THREE.Vector3(d.x, 0, d.y)
        });

        const box3 = ThreeTool.getBox3ByV3Array(v3Array);


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

    buildMesh(box3: THREE.Box3, radius: number) {
        const size = box3.getSize(new THREE.Vector3());
        const center = box3.getCenter(new THREE.Vector3());

        let _width = size.x + radius * 2;
        let _height = size.z + radius * 2;


        // @ts-ignore
        let canvas = this.heatmap._renderer.canvas
        const geometry = THREE.PlaneGeometry.fromJSON({
            width: _width,
            height: _height,
            widthSegments: this.options.widthSegments,
            heightSegments: this.options.heightSegments,
        });
        const material = new THREE.MeshBasicMaterial();
        material.map = canvas ? new THREE.CanvasTexture(canvas) : null;
        const plane = new THREE.Mesh(geometry, material);
        this.add(plane);
        this.position.copy(center)
    }

    setHeatmapMaterial() {
        const material = new THREE.MeshBasicMaterial();
        const heatmap = this.heatmap;
        // @ts-ignore
        
        // @ts-ignore
        const texture = new THREE.CanvasTexture(heatmap._renderer.canvas)
        
        material.map = texture;
        material.side = THREE.DoubleSide;
        material.transparent = true;
        material.onBeforeCompile = (shader) => {
            
            shader.uniforms["height"] = {value: this.options.zoom};
            shader.vertexShader = shader.vertexShader.replace("#include <common>", `
						#include <common>
						uniform sampler2D map;
						uniform float height;`);
            shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
			 vec4 frgColor = texture2D(map, uv);
			 float z = height * frgColor.a;
			 transformed = vec3( position.x, position.y, z);`);
            // 
        };

        var link = document.createElement('a');
        // @ts-ignore
        link.href = heatmap._renderer.canvas.toDataURL('image/png');
        link.download = 'canvas_image.png';  // Specify the download file name
        // Trigger the download
        // link.click();
        return material;
    }

}

