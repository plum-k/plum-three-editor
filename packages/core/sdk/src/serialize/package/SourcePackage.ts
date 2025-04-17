import {IPackageOptions, Package} from "./Package";

import {DownloadTool} from "../../tool";
import {isNil} from "lodash-es";
import axios, {AxiosProgressEvent} from "axios";
import {Asset} from "../../component";
import {ESceneLoadType, ESceneSaveType} from "../../interface";


export interface ISourcePackageOptions extends IPackageOptions {
}

/**
 *
 */
export class SourcePackage extends Package {
    static Type = "three";

    constructor(options: ISourcePackageOptions) {
        super(options);
    }

    loadScene(): void {
        this.viewer.sceneLoadProgressSubject.next({
            type: ESceneLoadType.Load,
            name: `加载场景中`,
            total: 1,
            loaded: 0,
        })
        const options = this.viewer.options;
        const {appId, packagePath} = options;
        let Key = `${appId}/${appId}.${SourcePackage.Type}`
        if (isNil(appId)) {
            throw new Error("appId 为空");
        }
        if (isNil(packagePath) && !isNil(this.viewer.ossApi)) {
            // 从远程存储加载场景
            this.viewer.ossApi.head(Key).then((data) => {
                const url = this.viewer.ossApi!.signatureUrl(Key);
                axios.get(url, {
                    responseType: "blob",
                    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
                        const total = progressEvent.total;
                        const loaded = progressEvent.loaded;
                        if (total) {
                            const percentCompleted = Math.round((loaded * 100) / total);
                            // console.log(`下载进度: ${percentCompleted}%`);
                            this.viewer.sceneLoadProgressSubject.next({
                                type: ESceneLoadType.Down,
                                name: "下载场景包中",
                                total: total,
                                loaded: loaded,
                            })
                        }
                    }
                }).then(async (res) => {
                    await this.unpack(res.data);
                }).catch((err) => {
                    console.log(err)
                    this.viewer.setInitState()
                })
            }).catch((error) => {
                if (Reflect.get(error as object, "code") === "NoSuchKey") {
                    console.log("文件不存在");
                }
                this.viewer.setInitState()
            })
        } else {
            // 加载离线的包
            this.getPackByPath()
        }
    }

    /**
     * 获取远程场景文件, 可加载离线场景
     */
    getPackByPath() {
        const options = this.viewer.options;
        const {appId, packagePath} = options;
        fetch(`${packagePath}/${appId}.${SourcePackage.Type}`).then(res => res.blob()).then(async (blob) => {
            await this.unpack(blob);
        }).catch((err) => {
            console.log(err)
            this.viewer.setInitState()
        })
    }

    // 获取 three 场景的json数据
    toJson() {
        const sceneJson = this.viewer.scene.toJSON();
        // return {
        //     scene: sceneJson
        // }
        return sceneJson;
    }

    uploadPack(blob: Blob) {
        const appId = this.viewer.options.appId;
        if (!isNil(this.viewer.ossApi)) {
            const name = `${appId}/${appId}.${SourcePackage.Type}`;
            this.viewer.ossApi.put(name, blob).then((data) => {
                console.log(data)
                this.viewer.sceneSaveProgressSubject.next({
                    type: ESceneSaveType.Save,
                    name: `场景保存中`,
                    total: 1,
                    loaded: 1,
                })
            })
        }
    }

    getSceneBlob() {
        const json = this.toJson();
        return new Blob([JSON.stringify(json)], {type: 'application/json'});
    }

    downJson(name: string = "scene.json") {
        const blob = this.getSceneBlob();
        DownloadTool.save(blob, "scene.json");
    }

    override async pack() {
        const blob = this.getSceneBlob();
        this.uploadPack(blob);
    }

    override async unpack(blob: Blob) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const json = event.target.result as string;
            console.log(json);
            const asset = new Asset({
                result: json.scene,
                extension: "object"
            })
            this.assetManager.loadAsset(asset).then((scene) => {
                let _scene = scene as Scene;
                this.viewer.scene.copy(_scene);
                _scene = null;
            })
        };
        reader.readAsText(blob);
    }
}