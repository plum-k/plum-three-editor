import {AnimationClip, Mesh, Object3D, Points, Scene} from "three";
import {STLExporter, STLExporterOptions} from "three/examples/jsm/exporters/STLExporter.js";
import {PLYExporter, PLYExporterOptions} from "three/examples/jsm/exporters/PLYExporter.js";
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter.js";
import {defaults, isArrayBuffer, isString} from "lodash-es";
import {DownloadTool} from "./DownloadTool";
import {GLTFExporter, GLTFExporterOptions} from "three/examples/jsm/exporters/GLTFExporter.js";
import {DRACOExporter} from "three/examples/jsm/exporters/DRACOExporter.js";
import {USDZExporter} from "three/examples/jsm/exporters/USDZExporter.js";
import {DRACOExporterOptions} from "three/examples/jsm/exporters/DRACOExporter";

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

    /**
     * 导出DRC模型
     * @param object
     * @param InOptions
     */
    exportDRC(object: Mesh | Points, InOptions?: DRACOExporterOptions) {
        const options = defaults({
            decodeSpeed: 5,
            encodeSpeed: 5,
            encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
            quantization: [16, 8, 8, 8, 8],
            exportUvs: true,
            exportNormals: true,
            exportColor: object.geometry.hasAttribute('color')
        }, InOptions)
        const result = this.dRACOExporter.parse(object, options);
        DownloadTool.saveArrayBuffer(result, 'model.drc');
    }

    /**
     * 导出场景
     * @param scene
     * @param name
     * @param options
     */
    exportSceneGLB(scene: Scene, name: string = "scene.glb", options?: GLTFExporterOptions) {
        const animations = this.getAnimations(scene);

        const optimizedAnimations = [];
        for (const animation of animations) {
            optimizedAnimations.push(animation.clone().optimize());
        }
        this.gLTFExporter.parseAsync(scene, {
            binary: true, animations: optimizedAnimations,
            ...options
        }).then((result) => {
            if (isArrayBuffer(result)) {
                DownloadTool.saveArrayBuffer(result, name);
            } else {
                DownloadTool.saveString(JSON.stringify(result, null, 2), name);
            }
            console.log("result", result)
        })
    }

    /**
     * 导出glb模型
     * @param input
     * @param name
     * @param options
     */
    exportGLB(input: Object3D, name: string = "scene.glb", options?: GLTFExporterOptions) {
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
            DownloadTool.saveArrayBuffer(result, name);
        })
    }


    /**
     * 导出为OBJ
     * @param object
     * @param name
     */
    exportOBJ(object: Object3D, name: string = "model.obj") {
        DownloadTool.saveString(this.oBJExporter.parse(object), 'model.obj');
    }

    exportPLY(object: Object3D, name: string = "model.ply", options?: PLYExporterOptions) {
        this.pLYExporter.parse(object, (result) => {
            DownloadTool.saveArrayBuffer(result, 'model.ply');
        }, options);
    }

    exportSTL(scene: Object3D,name: string = "model.stl",  options?: STLExporterOptions) {
        let result = this.sTLExporter.parse(scene, options)
        if (isString(result)) {
            DownloadTool.saveString(result, name);
        } else {
            DownloadTool.saveArrayBuffer(result, name);
        }
    }

    exportUSDZ(scene: Scene) {
        this.uSDZExporter.parseAsync(scene).then((res) => {
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