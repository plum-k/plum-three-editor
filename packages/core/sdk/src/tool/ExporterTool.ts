import {DRACOExporter, GLTFExporter, USDZExporter,} from "three-stdlib";
import {AnimationClip, Mesh, Object3D, Points, Scene} from "three";
import {STLExporter, STLExporterOptions} from "three/examples/jsm/exporters/STLExporter";
import {PLYExporter, PLYExporterOptions} from "three/examples/jsm/exporters/PLYExporter";
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter";
import {GLTFExporterOptions} from "three-stdlib/exporters/GLTFExporter";
import {isString} from "lodash-es";
import {DownloadTool} from "./DownloadTool";

export class ExporterTool {
    static instance: ExporterTool;
    dRACOExporter: DRACOExporter;
    gLTFExporter: GLTFExporter;
    uSDZExporter: USDZExporter;
    sTLExporter: STLExporter;
    pLYExporter: PLYExporter;
    oBJExporter: OBJExporter;

    constructor() {
        this.dRACOExporter = new DRACOExporter();
        this.gLTFExporter = new GLTFExporter();
        this.uSDZExporter = new USDZExporter();
        this.sTLExporter = new STLExporter();
        this.pLYExporter = new PLYExporter();
        this.oBJExporter = new OBJExporter();
    }

    static getInstance() {
        if (!ExporterTool.instance) {
            ExporterTool.instance = new ExporterTool();
        }
        return ExporterTool.instance;
    }

    // 必须导出 场景

    // todo
    exportDRC(object: Mesh | Points, InOptions?: {
        decodeSpeed: number;
        encodeSpeed: number;
        encoderMethod: number;
        quantization: number[];
        exportUvs: boolean;
        exportNormals: boolean;
        exportColor: boolean;
    }) {
        const options = {
            decodeSpeed: 5,
            encodeSpeed: 5,
            encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
            quantization: [16, 8, 8, 8, 8],
            exportUvs: true,
            exportNormals: true,
            exportColor: object.geometry.hasAttribute('color')
        };

        const result = this.dRACOExporter.parse(object, options);
        DownloadTool.saveArrayBuffer(result, 'model.drc');
    }

    exportGLB(input: Object3D, options?: GLTFExporterOptions) {
        const animations = this.getAnimations(input);

        const optimizedAnimations = [];

        for (const animation of animations) {
            optimizedAnimations.push(animation.clone().optimize());
        }
        // todo 判断是否二进制
        this.gLTFExporter.parseAsync(input, {
            binary: true, animations: optimizedAnimations,
            ...options
        }).then((result) => {
            DownloadTool.saveArrayBuffer(result, 'scene.glb');
        })
    }


    exportOBJ(object: Object3D) {
        DownloadTool.saveString(this.oBJExporter.parse(object), 'model.obj');
    }

    exportPLY(object: Object3D, options?: PLYExporterOptions) {
        this.pLYExporter.parse(object, (result) => {
            DownloadTool.saveArrayBuffer(result, 'model.ply');
        }, options);
    }

    exportSTL(scene: Object3D, options?: STLExporterOptions) {
        let result = this.sTLExporter.parse(scene, options)
        if (isString(result)) {
            DownloadTool.saveString(result, 'model.stl');
        } else {
            DownloadTool.saveArrayBuffer(result, 'model.stl');
        }
    }

    exportUSDZ(scene: Scene) {
        this.uSDZExporter.parse(scene).then((res) => {
            DownloadTool.saveArrayBuffer(res, 'model.usdz');
        })
    }

    getAnimations(scene: Scene) {
        const animations: AnimationClip[] = [];
        scene.traverse((object) => {
            animations.push(...object.animations);
        });
        return animations;
    }

    objectExport(object: Object3D) {
        let output = object.toJSON();
        let outputString = "";
        try {
            outputString = JSON.stringify(output, null, '\t');
            outputString = outputString.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            outputString = JSON.stringify(output);
        }
        let name = object.name === "" ? "object" : object.name;
        DownloadTool.save(new Blob([outputString]), `${name}.json`);
    }

    materialExport(object: Mesh, currentMaterialSlot = 0) {
        const material = Array.isArray(object.material) ? object.material[currentMaterialSlot] : object.material;
        let outputString = "";
        let output = material.toJSON();
        try {
            outputString = JSON.stringify(outputString, null, '\t');
            outputString = outputString.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            outputString = JSON.stringify(output);
        }
        let name = material.name === "" ? "object" : material.name;
        DownloadTool.save(new Blob([outputString]), `${material}.json`);
    }


    geometryExport(object: Mesh) {
        const geometry = object.geometry;
        let output = geometry.toJSON();
        let outputString = "";
        try {
            outputString = JSON.stringify(outputString, null, '\t');
            outputString = outputString.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
        } catch (e) {
            outputString = JSON.stringify(output);
        }
        let name = geometry.name === "" ? "geometry" : geometry.name;
        DownloadTool.save(new Blob([outputString]), `${name}.json`);
    }
}