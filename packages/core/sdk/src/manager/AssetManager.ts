import {isNil, isString} from "lodash-es";
import {
    AudioLoader,
    CubeTextureLoader,
    FileLoader,
    Loader,
    LoadingManager,
    ObjectLoader,
    Texture,
    TextureLoader
} from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import Asset from "../core/asset/Asset";
import BasePlum, {IBasePlumOptions} from "../core/BasePlum";
import {
    LDrawLoader,
    LUT3dlLoader,
    MMDLoader,
    OBJLoader,
    PCDLoader,
    PDBLoader,
    RGBELoader,
    Rhino3dmLoader,
    TGALoader
} from "three-stdlib";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader";
import {GainMapLoader, HDRJPGLoader} from "@monogrid/gainmap-js";
import {buildGraph} from "../tool/buildGraph";
import {Subject} from "rxjs";
import GltfModelAsset from "../core/asset/GltfModelAsset";
import TextureAsset from "../core/asset/TextureAsset";
import {loadFiles, loadItemList} from "@plum-render/tool";

export interface IResourceManagers extends IBasePlumOptions {
    sdkUrl?: string;
}

export interface ILoadFun {
    before?: Function,
    after?: Function,
    tail?: Function,
}

export interface IStartSubject {
    url: string;
    loaded: number;
    total: number;
}

export interface ILoadSubject {

}

export interface IProgressSubject {
    url: string;
    loaded: number;
    total: number;
}

export interface IErrorSubject {
    url: string;
}

export interface loadAssetOption {

}

export type LoaderProto<T> = new (...args: any) => Loader<T extends unknown ? any : T>

type LoaderReturnType<L extends OBJLoader | GLTFLoader> = ReturnType<L['loadAsync']>;
type JJ = GLTFLoader["loadAsync"]
type CC = ReturnType<GLTFLoader["loadAsync"]>
const DefaultLoadFun = {
    after: () => {
    },
    before: () => {
    },
    tail: () => {
    },
}
export default class AssetManager extends BasePlum {
    loadingManager: LoadingManager;
    dracoLoader!: DRACOLoader;
    sdkUrl: string = "";
    gLTFLoader!: GLTFLoader;
    textureLoader!: TextureLoader;

    memoizedLoaders = new WeakMap<LoaderProto<any>, Loader<any>>()

    startSubject = new Subject<IStartSubject>();
    loadSubject = new Subject<ILoadSubject>();
    progressSubject = new Subject<IProgressSubject>();
    errorSubject = new Subject<IErrorSubject>();

    constructor(options: IResourceManagers) {
        super(options);

        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = this.onLoad;
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;

        this.initAllLoader();

        // const db = new Dexie('FriendDatabase');
        // db.version(1).stores({
        //     friends: '++id, age'
        // });
        this.addDrop();
    }

    initAllLoader() {
        // let loader = this.memoizedLoaders.get(Proto)!
        // if (!loader) {
        //     loader = new Proto()
        // }
        this.dracoLoader = new DRACOLoader(this.loadingManager);
        this.dracoLoader.setDecoderPath(`${this.sdkUrl}/libs/draco/`);
        this.dracoLoader.preload();
        this.memoizedLoaders.set(DRACOLoader, this.dracoLoader)

        const gLTFLoader = new GLTFLoader(this.loadingManager);
        gLTFLoader.setDRACOLoader(this.dracoLoader);
        this.memoizedLoaders.set(GLTFLoader, gLTFLoader)

        this.textureLoader = new TextureLoader();
        this.memoizedLoaders.set(TextureLoader, this.textureLoader)


        const cubeTextureLoader = new CubeTextureLoader(this.loadingManager);
        this.memoizedLoaders.set(CubeTextureLoader as unknown as LoaderProto<any>, cubeTextureLoader as unknown as Loader<any>)

        const rGBELoader = new RGBELoader(this.loadingManager);
        this.memoizedLoaders.set(RGBELoader, rGBELoader)

        const eXRLoader = new EXRLoader(this.loadingManager);
        this.memoizedLoaders.set(EXRLoader, eXRLoader)

        const hDRJPGLoader = new HDRJPGLoader();
        this.memoizedLoaders.set(HDRJPGLoader, hDRJPGLoader)

        const gainMapLoader = new GainMapLoader();
        this.memoizedLoaders.set(GainMapLoader as unknown as LoaderProto<any>, gainMapLoader as unknown as Loader<any>)

        const fileLoader = new FileLoader(this.loadingManager);
        this.memoizedLoaders.set(FileLoader, fileLoader)

        const objectLoader = new ObjectLoader(this.loadingManager);
        this.memoizedLoaders.set(ObjectLoader, objectLoader)
    }


    onStart = (url: string, loaded: number, total: number) => {
        // console.log("onStart ", url, loaded, total)
        // console.log("onStart ", loaded, total)
        this.startSubject.next({url, loaded, total})
    }
    onLoad = () => {
        // console.log('onLoad ')
        this.loadSubject.next({})
    }
    onProgress = (url: string, loaded: number, total: number) => {
        // console.log("onProgress ", url, loaded, total)
        // console.log("onProgress ", loaded, total)
        this.progressSubject.next({url, loaded, total})
    }

    onError = (url: string) => {
        // console.log("onError ", url)
        this.errorSubject.next({url})
    }

    load(loaderType: any, asset: Asset, option: ILoadFun) {
        return new Promise<GLTF>((resolve, reject) => {

            let loader = this.memoizedLoaders.get(loaderType)
            const {before, after, tail} = option
            if (loader) {
                const url = asset.url;
                const result = asset.result;
                const name = asset.name;

                const loadSubject = asset.loadSubject;
                const progressSubject = asset.progressSubject;
                const loadFun = (data: any) => {
                    if (data.scene) {
                        // 修改下模型名称
                        data.scene.name = name;
                        // data.scene.animations.push(...data.animations);
                        Object.assign(data, buildGraph(data.scene))
                        loadSubject.next(data.scene);
                        resolve(data.scene);
                    } else {
                        loadSubject.next(data);
                        resolve(data);
                    }
                }
                const errorFun = (error: any) => {
                    loadSubject.error(error);
                    reject(error);
                }
                before && before(loader)
                if (!isNil(url)) {
                    // @ts-ignore
                    loader.load(url, loadFun, (xhr) => {
                        const progress = (xhr.loaded / xhr.total * 100)
                        progressSubject.next(progress)
                    }, errorFun);
                } else if (!isNil(result)) {
                    const parse = Reflect.get(loader, "parse");
                    if (parse) {
                        if (loader instanceof ObjectLoader) {
                            loader.parse(result, loadFun);
                        } else {
                            parse(result, "", loadFun, errorFun);
                        }
                    }
                }
            }
        })
    }

    loadAsset(asset: Asset, option: ILoadFun = DefaultLoadFun): Promise<CC> {
        const extension = asset.extension;
        return new Promise<CC>((resolve, reject) => {
            // @ts-ignore
            resolve("")
            let loader: any
            switch (extension) {
                case "object":
                    loader = ObjectLoader;
                    break;
                case "blob":
                case "zip":
                    loader = FileLoader;
                    break
                case "tga":
                    loader = TGALoader;
                    break;
                case "pdb":
                    loader = PDBLoader;
                    break;
                case "pcd":
                    loader = PCDLoader;
                    break;
                case "pmd":
                    loader = MMDLoader;
                    break;
                // case "cube":
                //     loader = LUTCubeLoader;
                //     break;
                case "3dl":
                    loader = LUT3dlLoader;
                    break;
                case "ldr":
                case "dat":
                    loader = LDrawLoader;
                    break;
                case "3dm":
                    loader = Rhino3dmLoader
                    break;
                case "obj":
                    loader = OBJLoader;
                    break;
                case "ogg":
                    loader = AudioLoader;
                    break;
                case "gltf":
                case "glb":
                    loader = GLTFLoader;
                    break;
                case 'cube':
                    loader = CubeTextureLoader;
                    break;
                case 'hdr':
                    loader = RGBELoader;
                    break;
                case 'exr':
                    loader = EXRLoader;
                    break;
                case 'jpg':
                case 'jpeg':
                    loader = HDRJPGLoader;
                    break;
                case 'webp':
                    loader = GainMapLoader;
                    break;
                default:
                    break;
            }
            if (loader) {
                this.load(loader, asset, option).then((data) => {
                    // @ts-ignore
                    resolve(data);
                }).catch((error) => {
                    reject(error)
                })
            } else {
                throw new Error("当前文件类型找不到,加载器");
            }
        })
    }

    loadGltf(asset: GltfModelAsset, option: ILoadFun = DefaultLoadFun) {
        return new Promise<GLTF>((resolve, reject) => {
            let loader = this.memoizedLoaders.get(GLTFLoader) as GLTFLoader;
            const {before, after, tail} = option
            if (loader) {
                let {url, result, name, file, fileReader, loadSubject, progressSubject} = asset;
                const loadFun = (data: any) => {
                    if (data.scene) {
                        // 修改下模型名称
                        data.scene.name = name;
                        // data.scene.animations.push(...data.animations);
                        Object.assign(data, buildGraph(data.scene))
                        loadSubject.next(data.scene);
                        resolve(data.scene);
                    } else {
                        loadSubject.next(data);
                        resolve(data);
                    }
                }
                const errorFun = (error: any) => {
                    loadSubject.error(error);
                    reject(error);
                }
                before && before(loader)
                if (!isNil(url)) {
                    loader.load(url, loadFun, (xhr) => {
                        const progress = Math.floor((xhr.loaded / xhr.total) * 100)
                        progressSubject.next(progress)
                    }, errorFun);
                } else if (!isNil(file) && !isNil(fileReader)) {
                    fileReader.addEventListener('progress', (event) => {
                        const size = '(' + this.formatNumber(Math.floor(event.total / 1000)) + ' KB)';
                        const progress = Math.floor((event.loaded / event.total) * 100)
                        progressSubject.next(progress)
                    });
                    fileReader.addEventListener('load', async (event) => {
                        const contents = event.target?.result;
                        if (!isNil(contents) && !isString(contents)) {
                            loader.parseAsync(contents, "").then(res => {
                                loadFun(res)
                            });
                        }
                    });
                    fileReader.readAsArrayBuffer(file);
                }
            }
        })
    }

    loadTexture(asset: TextureAsset, option: ILoadFun = DefaultLoadFun) {
        return new Promise<Texture>((resolve, reject) => {
            let loader = this.memoizedLoaders.get(TextureLoader) as TextureLoader;
            const {before, after, tail} = option
            if (loader) {
                let {url, result, name, file, fileReader, loadSubject, progressSubject} = asset;
                before && before(loader)
                if (!isNil(url)) {
                    loader.load(
                        url,
                        (texture) => {
                            loadSubject.next(texture);
                            resolve(texture);
                        },
                        (xhr) => {
                            const progress = Math.floor((xhr.loaded / xhr.total) * 100)
                            progressSubject.next(progress)
                        },
                        (error) => {
                            loadSubject.error(error);
                            reject(error);
                        });
                }
            }
        })
    }

    //------------------------- 离线文件加载 开始 -------------------

    // 注册拖放事件
    addDrop() {
        this.eventManager.dropSubject.subscribe((event) => {
            const items = event.dataTransfer!.items
            const files = event.dataTransfer!.files;
            if (items) {
                loadItemList(items, this.loadFile)
            } else {
                loadFiles(files as unknown as Array<File>, this.loadFile)
            }
        })
    }


    formatNumber(number: number) {
        return new Intl.NumberFormat('en-us', {useGrouping: true}).format(number);
    }

    loadFile(file: File, manager?: any) {
        const filename = file.name;
        const splitArray = filename.split('.')

        const extension = splitArray.pop()?.toLowerCase()

        switch (extension) {
            case "gltf":
            case 'glb': {
                const asset = new GltfModelAsset({
                    name: filename,
                    file: file,
                    extension: extension
                })
                this.loadGltf(asset).then(r => {

                })
                break;
            }
        }
    }

    //------------------------- 离线文件加载 结束 -------------------
}
