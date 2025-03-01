import {Module, IModuleOptions } from "./Module";
import {SerializeInterface} from "./serialize";
import {Asset} from "./asset/Asset";
import * as THREE from "three";
import {isString} from "lodash-es";
import {Serialize} from "./serialize/Serialize";

export interface ISerializeSceneOptions extends IModuleOptions  {
}

export class SerializeScene extends Module {
    serialize: Serialize

    constructor(options: ISerializeSceneOptions) {
        super(options);
        this.serialize = new Serialize();
    }

    //------------------------ three原生json 的导入导出 开始
    // 获取 three 场景的json数据
    toJson() {
        const sceneJson = this.viewer.scene.toJSON();
        return {
            scene: sceneJson
        }
    }

    // 导入 three 的json 数据还原场景
    fromJSON(json: SerializeInterface.Viewer) {
        // 通过对象加载器解析场景
        const asset = new Asset({
            result: json.scene,
            extension: "object"
        })
        this.assetManager.loadAsset(asset).then((scene) => {
            let _scene = scene as THREE.Scene;
            this.viewer.scene.copy(_scene);
            _scene = null;
        })
    }

    downJson(name: string = "scene.json") {
        const json = this.toJson();
        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});
        this.downBlob(blob, name);
    }

    downBlob(blob: Blob, filename: string = "scene.json") {
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = filename
        link.dispatchEvent(new MouseEvent('click'));
    }

    //------------------------ three原生json 的导入导出 结束

    //------------------------ 压缩后three的导入导出 开始
    pack() {
        function getObjectSize(obj) {
            const sizeInBytes = new Blob([isString(obj) ? obj : JSON.stringify(obj)]).size; // 计算字节大小
            const sizeInMB = sizeInBytes / (1024 * 1024); // 转换为 MB
            console.log(`Object size: ${sizeInMB.toFixed(6)} MB`);
        }

        let json = this.toJson();
        getObjectSize(json)


        return this.serialize.pack(json as unknown as SerializeInterface.Viewer)
    }

    // 根据 URL 加载场景
    loadSceneByUrl(url: string) {
        if (url) {
            let asset = new Asset({loadUrl: url, extension: "blob"}); // 创建资源实例
            const config = {
                before: (loader: THREE.FileLoader) => {
                    loader.setResponseType('blob'); // 设置响应类型为 blob
                }
            };
            this.assetManager.loadAsset(asset, config).then((data) => {
                this.serialize.unpack(data).then((res) => {
                    this.fromJSON(res); // 从 JSON 反序列化
                });
            });
        }
    }

    downPack(name: string = "scene.zip") {
        this.pack().then(res => {
            const blob = new Blob([res], {type: 'application/zip'});
            this.downBlob(blob, name);
        })
    }

    //------------------------ 压缩后three的导入导出 结束
}