import {IPackageOptions, Package} from "./Package";
import {chunk, isNil, split} from "lodash-es";
import {Serialize} from "../SerializeInterface";
import {Asset, ESceneLoadType, ESceneSaveType} from "../../core";
import * as THREE from "three";
import {BlobReader, BlobWriter, Entry, Uint8ArrayWriter, ZipReader, ZipWriter} from "@zip.js/zip.js";
import {SerializerTool} from "../SerializerTool";
import axios, {AxiosProgressEvent} from "axios";

export interface IChunkSerializeOptions extends IPackageOptions {
}


/**
 * 大场景对象序列化为json时, 会因为超出长度, 而失败, 需要把对象分块打包
 */
export class ChunkSerialize extends Package {
    static Type = "chunk";

    constructor(options: IChunkSerializeOptions) {
        super(options);
    }

    loadScene(): void {
        console.log(new Error('加载场景中').stack)
        this.viewer.sceneLoadProgressSubject.next({
            type: ESceneLoadType.Load,
            name: `加载场景中`,
            total: 1,
            loaded: 0,
        })
        const options = this.viewer.options;
        const {appId, packagePath} = options;
        let Key = `${this.viewer.options.ossBaseUrl}/scene/${appId}/${appId}.${ChunkSerialize.Type}`
        if (isNil(appId)) {
            throw new Error("appId 为空");
        }
        if (isNil(packagePath) && !isNil(this.viewer.ossApi)) {
            // 从远程存储加载场景
            this.viewer.ossApi.head(Key).then((data) => {
                const url = this.viewer.ossApi!.signatureUrl(Key);
                console.log("获取 url", url)
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

    override async pack() {
        let viewerJson = this.viewer.toJSON() as unknown as Serialize.ViewerJson;
        const sceneJson = viewerJson.scene;
        const {geometries, materials} = sceneJson;
        
        const geometriesBlob = await this.packMaterialsOrVertexData(geometries, "geometries", 100);
        const materialsBlob = await this.packMaterialsOrVertexData(materials, "materials", 300);
        console.log("viewerJson",viewerJson)
        const zipWriter = new ZipWriter(new BlobWriter());

        const viewerInfo = this.packSceneInfo(viewerJson);
        await zipWriter.add("viewerInfo.bin", viewerInfo, {
            onprogress: (progress: number, total: number) => {
                this.viewer.sceneSaveProgressSubject.next({
                    type: ESceneSaveType.Zip,
                    name: `制作场景包中`,
                    total: total,
                    loaded: progress,
                })
                return undefined;
            }
        });
        await zipWriter.add("geometries.zip", new BlobReader(geometriesBlob), {
            onprogress: (progress: number, total: number) => {
                this.viewer.sceneSaveProgressSubject.next({
                    type: ESceneSaveType.Zip,
                    name: `制作顶点包中`,
                    total: total,
                    loaded: progress,
                })
                return undefined;
            }
        });
        await zipWriter.add("materials.zip", new BlobReader(materialsBlob), {
            onprogress: (progress: number, total: number) => {
                this.viewer.sceneSaveProgressSubject.next({
                    type: ESceneSaveType.Zip,
                    name: `制作材质包中`,
                    total: total,
                    loaded: progress,
                })
                return undefined;
            }
        });

        const blob = new Blob([await zipWriter.close(undefined)], {type: "octet/stream"});
        this.uploadPack(blob);
    }

    override async unpack(blob: Blob) {
        const zipFileReader = new BlobReader(blob);
        const zipReader = new ZipReader(zipFileReader);
        const entries = await zipReader.getEntries();

        let viewerInfo = {} as Serialize.ViewerJson

        let materials: Array<any> = []
        let geometries: Array<any> = []
        
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            if (entry.filename === "viewerInfo.bin" && entry.getData) {
                viewerInfo = await this.unPackSceneInfo(entry);
            }
            if (entry.filename === "geometries.zip" && entry.getData) {
                geometries = await this.unPackMaterialsOrVertexData(entry, "geometries");
            }
            if (entry.filename === "materials.zip" && entry.getData) {
                materials = await this.unPackMaterialsOrVertexData(entry, "materials");
            }
        }
        await zipReader.close();
        viewerInfo.scene.geometries = geometries;
        viewerInfo.scene.materials = materials;

        console.log("还原场景数据", viewerInfo)
        const asset = new Asset({
            result: viewerInfo.scene,
            extension: "object"
        })
        const scene = await this.assetManager.loadObject(asset) as THREE.Scene;
        this.viewer.scene.copy(scene);
        await this.viewer.cameraManager.fromJSON(viewerInfo.cameraManager);
        this.viewer.setInitState()
    }

    uploadPack(blob: Blob) {
        const appId = this.viewer.options.appId;
        if (!isNil(this.viewer.ossApi)) {
            const name = `${this.viewer.options.ossBaseUrl}/scene/${appId}/${appId}.${ChunkSerialize.Type}`;
            this.viewer.ossApi.put(name, blob).then((data) => {
                console.log(data)
                this.viewer.sceneSaveProgressSubject.next({
                    type: ESceneSaveType.Save,
                    name: `场景保存中`,
                    total: 1,
                    loaded: 0,
                })
            })
        }
    }

    packSceneInfo(viewerJson: Serialize.ViewerJson) {
        viewerJson.scene.geometries = [];
        viewerJson.scene.materials = [];
        return SerializerTool.createUint8ArrayReaderPack(viewerJson);
    }

    // 打包材质或顶点
    async packMaterialsOrVertexData(materials: Array<any>, packName: string, size: number) {
        const chunkedArray = chunk(materials, size);
        const zipWriter = new ZipWriter(new BlobWriter());
        for (let i = 0; i < chunkedArray.length; i++) {
            const chunk = chunkedArray[i];
            const uint8ArrayReader = SerializerTool.createUint8ArrayReaderPack(chunk);
            await zipWriter.add(`${packName}-chunk-${i}.bin`, uint8ArrayReader, {
                onprogress: (progress: number, total: number) => {
                    let isMaterials = packName === "materials"
                    let name = isMaterials ? `压缩材质分包 ${i}` : `压缩顶点分包 ${i}`
                    this.viewer.sceneSaveProgressSubject.next({
                        type: ESceneSaveType.Zip,
                        name: name,
                        total: total,
                        loaded: progress,
                    })
                    return undefined;
                }
            });
        }
        return new Blob([await zipWriter.close(undefined,)], {type: "octet/stream"});
    }

    async unPackSceneInfo(entry: Entry) {
        const uint8ArrayWriter = await entry.getData!(new Uint8ArrayWriter(), {
            onprogress: (progress: number, total: number) => {
                // this.sceneLoadProgressSubject.next({
                //     type: "unZip",
                //     total: total,
                //     progress: progress
                // });
                return undefined;
            }
        });

        return SerializerTool.parseUint8ArrayReaderPack(uint8ArrayWriter);
    }

    /**
     * 解包材质或顶点
     */
    async unPackMaterialsOrVertexData(entry: Entry, type: string) {
        let isMaterials = type === "materials"
        const blob = await entry.getData!(new BlobWriter(), {
            onprogress: (progress: number, total: number) => {
                let name = isMaterials ? `解压材质包中` : `解压顶点包中`
                this.viewer.sceneLoadProgressSubject.next({
                    type: ESceneLoadType.UnZip,
                    name: name,
                    total: total,
                    loaded: progress,
                })
                return undefined;
            }
        });

        const zipFileReader = new BlobReader(blob);
        const zipReader = new ZipReader(zipFileReader);
        const entries = await zipReader.getEntries();

        let jsonArray = []

        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            if (entry.getData) {
                const uint8ArrayWriter = await entry.getData!(new Uint8ArrayWriter(), {
                    onprogress: (progress: number, total: number) => {
                        const parts = split(entry.filename, '-');
                        const filename = parts[parts.length - 1];
                        const index = filename.slice(0, -4);
                        let name = isMaterials ? `提取材质分包 ${index}` : `提取顶点分包 ${index}`
                        this.viewer.sceneLoadProgressSubject.next({
                            type: ESceneLoadType.UnZip,
                            name: name,
                            total: total,
                            loaded: progress,
                        })
                        return undefined;
                    }
                });
                let json = SerializerTool.parseUint8ArrayReaderPack(uint8ArrayWriter);
                jsonArray.push(...json);
            }
        }
        await zipReader.close();
        return jsonArray;
    }

    /**
     * 获取远程场景文件, 可加载离线场景
     */
    getPackByPath() {
        const options = this.viewer.options;
        const {appId, packagePath} = options;
        fetch(`${packagePath}/${appId}.chunk`).then(res => res.blob()).then(async (blob) => {
            await this.unpack(blob);
        }).catch((err) => {
            console.log(err)
            this.viewer.setInitState()
        })
    }
}