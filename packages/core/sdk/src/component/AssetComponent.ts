import {isNil, isString} from "lodash-es";
import {Subject} from "rxjs";
import {
    AudioLoader,
    CubeTextureLoader,
    FileLoader,
    Loader,
    LoadingManager,
    Object3D,
    ObjectLoader,
    TextureLoader
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader.js";
import {GainMapLoader, HDRJPGLoader} from "@monogrid/gainmap-js";
import {KTX2Loader} from "three/examples/jsm/loaders/KTX2Loader.js";
import {PDBLoader} from "three/examples/jsm/loaders/PDBLoader.js";
import {PCDLoader} from "three/examples/jsm/loaders/PCDLoader.js";
import {LUTCubeLoader} from "three/examples/jsm/loaders/LUTCubeLoader.js";
import {LUT3dlLoader} from "three/examples/jsm/loaders/LUT3dlLoader.js";
import {LDrawLoader} from "three/examples/jsm/loaders/LDrawLoader.js";
import {Rhino3dmLoader} from "three/examples/jsm/loaders/3DMLoader.js";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader.js";
import {TGALoader} from "three/examples/jsm/loaders/TGALoader.js";
import {MDDLoader} from "three/examples/jsm/loaders/MDDLoader.js";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader.js";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader.js";
import {Asset} from "./asset";
import {Component, IComponentOptions} from "./Component";

export interface IAssetComponentOptions extends IComponentOptions {
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

const DefaultLoadFun = {
    after: () => {
    },
    before: () => {
    },
    tail: () => {
    },
}

export class AssetComponent extends Component {

    sdkUrl: string = "";

    startSubject = new Subject<IStartSubject>();
    loadSubject = new Subject<ILoadSubject>();
    progressSubject = new Subject<IProgressSubject>();
    errorSubject = new Subject<IErrorSubject>();
    //--------------------
    loadingManager: LoadingManager;
    gLTFLoader: GLTFLoader;
    fbxLoader: FBXLoader;
    dracoLoader: DRACOLoader;
    textureLoader: TextureLoader;
    kTX2Loader: KTX2Loader;
    cubeTextureLoader: CubeTextureLoader;
    rGBELoader: RGBELoader;
    eXRLoader: EXRLoader;
    hDRJPGLoader: HDRJPGLoader;
    gainMapLoader: GainMapLoader;
    fileLoader: FileLoader;
    objectLoader: ObjectLoader;
    tGALoader: TGALoader;
    pDBLoader: PDBLoader;
    pCDLoader: PCDLoader;
    mMDLoader: MDDLoader;
    lUTCubeLoader: LUTCubeLoader;
    lUT3dlLoader: LUT3dlLoader;
    lDrawLoader: LDrawLoader;
    rhino3dmLoader: Rhino3dmLoader;
    oBJLoader: OBJLoader;
    audioLoader: AudioLoader;
    colladaLoader: ColladaLoader;

    constructor(options: IAssetComponentOptions) {
        super(options);

        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = this.onLoad;
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;

        // const db = new Dexie('FriendDatabase');
        // db.version(1).stores({
        //     friends: '++id, age'
        // });
        this.addDrop();

        this.dracoLoader = new DRACOLoader(this.loadingManager);
        this.dracoLoader.setDecoderPath(`${this.sdkUrl}/libs/draco/`);
        this.dracoLoader.preload();

        this.textureLoader = new TextureLoader();

        this.kTX2Loader = new KTX2Loader();
        this.kTX2Loader.setTranscoderPath(`${this.sdkUrl}/libs/basis/`);
        this.kTX2Loader.detectSupport(this.viewer.renderComponent.renderer);

        this.gLTFLoader = new GLTFLoader(this.loadingManager);
        this.gLTFLoader.setDRACOLoader(this.dracoLoader);
        this.gLTFLoader.setKTX2Loader(this.kTX2Loader);

        this.fbxLoader = new FBXLoader(this.loadingManager);

        this.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);

        this.rGBELoader = new RGBELoader(this.loadingManager);

        this.eXRLoader = new EXRLoader(this.loadingManager);

        this.hDRJPGLoader = new HDRJPGLoader();

        this.tGALoader = new TGALoader(this.loadingManager);

        this.gainMapLoader = new GainMapLoader();

        this.fileLoader = new FileLoader(this.loadingManager);

        this.objectLoader = new ObjectLoader(this.loadingManager);

        this.pDBLoader = new PDBLoader(this.loadingManager);
        this.pCDLoader = new PCDLoader(this.loadingManager);
        this.mMDLoader = new MDDLoader(this.loadingManager);
        this.lUTCubeLoader = new LUTCubeLoader(this.loadingManager);
        this.lUT3dlLoader = new LUT3dlLoader(this.loadingManager);
        this.lDrawLoader = new LDrawLoader(this.loadingManager);
        this.rhino3dmLoader = new Rhino3dmLoader(this.loadingManager);
        this.oBJLoader = new OBJLoader(this.loadingManager);
        this.audioLoader = new AudioLoader(this.loadingManager);
        this.cubeTextureLoader = new CubeTextureLoader(this.loadingManager);
        this.eXRLoader = new EXRLoader(this.loadingManager);
        this.colladaLoader = new ColladaLoader(this.loadingManager);
    }


    onStart = (url: string, loaded: number, total: number) => {
        // 
        // 
        this.startSubject.next({url, loaded, total})
    }
    onLoad = () => {
        // 
        this.loadSubject.next({})
    }
    onProgress = (url: string, loaded: number, total: number) => {
        // 
        // 
        this.progressSubject.next({url, loaded, total})
    }

    onError = (url: string) => {
        // 
        this.errorSubject.next({url})
    }

    buildPromise<T>(asset: Asset, fun: Function): Promise<T> {
        const {loadSubject, errorSubject} = asset;
        return new Promise<any>((resolve, reject) => {
            loadSubject.subscribe((value) => {
                resolve(value);
            })
            errorSubject.subscribe((error) => {
                reject(error);
            })
            fun && fun();
        })
    }

    loadRGBE(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.rGBELoader
            const {before, after, tail,} = option
            if (loader) {
                let {url, file, onLoad, onProgress, onError, loadFile} = asset;
                before && before(loader)
                if (!isNil(url)) {
                    loader.load(url, onLoad, onProgress, onError);
                } else if (!isNil(file)) {
                    loadFile((event) => {
                        const contents = event.target?.result;
                        if (!contents) return
                        const blobURL = URL.createObjectURL(new Blob([contents]));
                        loader.load(blobURL, onLoad, onProgress, onError);
                    });
                }
            }
        })
    }


    loadTGA(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return new Promise<any>((resolve, reject) => {
            let loader = this.tGALoader;
            const {before, after, tail,} = option
            if (loader) {
                // 对结果进行处理 todo
                let {
                    url, file
                    , onLoad
                    , onProgress, onError, loadFile
                } = asset;
                before && before(loader)
                if (!isNil(url)) {
                    loader.load(url, onLoad, onProgress, onError);
                } else if (!isNil(file)) {
                    loadFile((event) => {
                        const contents = event.target?.result;
                        if (!isString(contents)) return
                        loader.load(contents, onLoad, onProgress, onError);
                    });
                }
            }
        })
    }

    loadKtx2(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.kTX2Loader
            const {before, after, tail,} = option
            let {
                url, result, name, file
                , onLoad
                , onProgress, onError, loadFile,
            } = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(file)) {
                loadFile((event) => {
                    const contents = event.target?.result;
                    if (!contents) return
                    const blobURL = URL.createObjectURL(new Blob([contents]));
                    loader.load(blobURL, onLoad, onProgress, onError);
                });
            }
        })
    }

    loadTexture(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.textureLoader;
            const {before, after, tail} = option;
            let {url, file, onLoad, onProgress, onError, loadFile} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(file)) {
                loadFile((event) => {
                    const contents = event.target?.result;
                    if (!contents) return
                    const blobURL = URL.createObjectURL(new Blob([contents]));
                    loader.load(blobURL, onLoad, onProgress, onError);
                });
            }
        })
    }

    loadGltf(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise<Object3D>(asset, () => {
            let loader = this.gLTFLoader;
            const {before, after, tail} = option;
            let {url, name, file, loadSubject, onProgress, onError, loadFile} = asset;
            const loadFun = (data: any) => {
                if (data.scene) {
                    // 修改下模型名称
                    data.scene.name = name;
                    data.scene.animations.push(...data.animations);
                    // todo 通过名称快速查找对象
                    // Object.assign(data, buildGraph(data.scene))
                }
                loadSubject.next(data.scene);
            }
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, loadFun, onProgress, onError);
            } else if (!isNil(file)) {
                loadFile((event) => {
                    const contents = event.target?.result;
                    if (!isNil(contents) && !isString(contents)) {
                        loader.parseAsync(contents, "").then(res => {
                            loadFun(res)
                        });
                    }
                })
            }
        })
    }

    loadFbx(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise<Object3D>(asset, () => {
            let loader = this.fbxLoader;
            const {before, after, tail} = option;
            let {url, name, file, loadSubject, onProgress, onError, loadFile} = asset;
            const loadFun = (data: any) => {
                if (data.scene) {
                    // 修改下模型名称
                    data.scene.name = name;
                    data.scene.animations.push(...data.animations);
                    // todo 通过名称快速查找对象
                    // Object.assign(data, buildGraph(data.scene))
                }
                loadSubject.next(data.scene);
            }
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, loadFun, onProgress, onError);
            } else if (!isNil(file)) {
                loadFile((event) => {
                    const contents = event.target?.result;
                    if (!isNil(contents) && !isString(contents)) {
                        const group = loader.parse(contents, "");
                        loadFun(group)
                    }
                })
            }
        })
    }

    loadObject(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.objectLoader;
            const {before, after, tail} = option
            let {url, result, loadSubject, onLoad, onProgress, onError} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
                loader.parse(result, (data) => {
                        console.log("解析完成")
                        loadSubject.next(data);
                    }
                )
            }
        })
    }

    loadPDB(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.pDBLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError, loadFile} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress,
                    onError);
            } else if (!isNil(result)) {
                if (isString(result)) {
                    loader.parse(result);
                }
            }
        })
    }

    loadPCD(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.pCDLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
                loader.parse(result);
            }
        })
    }

    loadCollada(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.colladaLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
                if (isString(result)) {
                    loader.parse(result, "");
                }
            }
        })
    }

    loadMMD(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.mMDLoader;
            const {before, after, tail} = option
            let {
                url,
                result,
                onLoad,
                onProgress,
                onError,
            } = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadLUTCube(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.lUTCubeLoader;
            const {before, after, tail} = option
            let {
                url,
                result,
                onLoad,
                onProgress,
                onError,
            } = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadLUT3d(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.lUT3dlLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadLDraw(asset: Asset, option: ILoadFun = DefaultLoadFun) {

        return this.buildPromise(asset, () => {
            let loader = this.lDrawLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadRhino3dm(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.rhino3dmLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadOBJ(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.oBJLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadAudio(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.audioLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadCubeTexture(asset: Asset, option: ILoadFun = DefaultLoadFun) {

        return this.buildPromise(asset, () => {
            let loader = this.cubeTextureLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                // todo 没用
                //@ts-ignore
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadEXR(asset: Asset, option: ILoadFun = DefaultLoadFun) {

        return this.buildPromise(asset, () => {
            let loader = this.eXRLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadFile(asset: Asset, option: ILoadFun = DefaultLoadFun) {
        return this.buildPromise(asset, () => {
            let loader = this.eXRLoader;
            const {before, after, tail} = option
            let {url, result, onLoad, onProgress, onError,} = asset;
            before && before(loader)
            if (!isNil(url)) {
                loader.load(url, onLoad, onProgress, onError);
            } else if (!isNil(result)) {
            }
        })
    }

    loadAsset(asset: Asset, option: ILoadFun = DefaultLoadFun): Promise<any> {
        const extension = asset.extension;
        switch (extension) {
            case "dae":
                return this.loadCollada(asset, option)
            case "object":
                return this.loadObject(asset, option)
            case "blob":
            case "zip":
                return this.loadFile(asset, option)
            case "tga":
                return this.loadTGA(asset, option)
            case "ktx2":
                return this.loadKtx2(asset, option)
            case "pdb":
                return this.loadPDB(asset, option)
            case "pcd":
                return this.loadPCD(asset, option)
            case "pmd":
                return this.loadMMD(asset, option)
            // case "cube":
            //     return this.lUTCubeLoad(asset, option)
            case "3dl":
                return this.loadLUT3d(asset, option)
            case "ldr":
            case "dat":
                return this.loadLDraw(asset, option)
            case "3dm":
                return this.loadRhino3dm(asset, option)
            case "obj":
                return this.loadOBJ(asset, option)
            case "ogg":
                return this.loadAudio(asset, option)
            case "gltf":
            case "glb":
                return this.loadGltf(asset, option)
            case "fbx":
                return this.loadFbx(asset, option)
            case 'cube':
                return this.loadCubeTexture(asset, option)
            case 'hdr':
            case "pic":
                return this.loadRGBE(asset, option)
            case 'exr':
                return this.loadEXR(asset, option)
            case 'jpg':
            case 'png':
            case 'jpeg':
                return this.loadTexture(asset, option)
                // case 'webp':
                // loader = GainMapLoader;
                break;
            default:
                throw new Error(`无法识别的文件类型：${extension}`)
        }
    }


    //------------------------- 离线文件加载 开始 -------------------

    // 注册拖放事件
    addDrop() {
        this.eventManager.dropSubject.subscribe((event) => {

        })
    }

    // 拖动事件
    dragHandler(event: DragEvent) {
        const items = event.dataTransfer!.items
        const files = event.dataTransfer!.files;
        if (items) {
            this.loadItemList(items, this.loadDragFile)
        } else {
            this.loadFiles(files as unknown as Array<File>, this.loadDragFile)
        }
    }

    // 定义函数getFilesFromItemList，用于从DataTransferItemList中获取文件相关信息
    // 参数items是要处理的DataTransferItemList对象，包含了拖放操作等传递过来的文件或目录相关条目
    // 参数onDone是一个回调函数，当所有文件处理完成后会被调用，接收处理后的文件数组和文件映射作为参数
    getFilesFromItemList(items: DataTransferItemList, onDone: (files: Array<File>, filesMap: Map<string, File>) => void) {
        // 用于记录已经处理完成的条目数量
        let itemsCount = 0;
        // 用于记录总的条目数量
        let itemsTotal = 0;

        // 用于存储获取到的文件数组
        const files: Array<File> = [];
        // 用于存储文件路径到文件对象的映射，方便根据路径快速查找文件
        const filesMap = new Map<string, File>();

        // 定义函数onEntryHandled，用于在处理完一个条目后更新已处理条目数量，并在所有条目处理完成时调用onDone回调函数
        const onEntryHandled = () => {
            // 已处理条目数量加1
            itemsCount++;
            // 如果已处理条目数量等于总条目数量，说明所有条目都已处理完成，调用onDone回调函数传递处理后的文件和文件映射
            if (itemsCount === itemsTotal) {
                onDone(files, filesMap);
            }
        };

        // 定义函数handleEntry，用于处理单个条目（文件或目录）
        const handleEntry = (entry: FileSystemEntry | null) => {
            if (entry === null) {
                return;
            }
            // 如果条目是一个目录
            if (entry.isDirectory) {
                // 创建一个目录读取器对象，用于读取目录中的内容
                const reader = (entry as FileSystemDirectoryEntry).createReader();
                // 使用读取器读取目录中的所有条目，并在读取完成后进行处理
                reader.readEntries((entries) => {
                    // 遍历读取到的每个条目
                    for (let i = 0; i < entries.length; i++) {
                        // 递归调用handleEntry函数处理每个子条目
                        handleEntry(entries[i]);
                    }
                    // 处理完当前目录下的所有条目后，调用onEntryHandled函数更新处理状态
                    onEntryHandled();
                });
            } else if (entry.isFile) {
                // 如果条目是一个文件
                // 通过entry.file方法获取文件对象，并在获取到文件后进行处理
                (entry as FileSystemFileEntry).file((file) => {
                    // 将获取到的文件添加到files数组中
                    files.push(file);
                    // 将文件对象添加到filesMap映射中，以文件的相对路径（去掉开头的'/'）作为键，方便后续根据路径查找文件
                    filesMap.set(entry.fullPath.slice(1), file);
                    // 处理完当前文件后，调用onEntryHandled函数更新处理状态
                    onEntryHandled();
                });
            }

            // 更新总的条目数量，无论当前条目是文件还是目录，都需要增加总条目数量
            itemsTotal++;
        };

        // 遍历DataTransferItemList中的每个条目
        for (let i = 0; i < items.length; i++) {
            // 获取当前条目
            const item = items[i];
            // 如果当前条目类型是文件（这里通过kind属性判断，可能是基于特定的拖放或文件操作相关规范）
            if (item.kind === 'file') {
                // 通过webkitGetAsEntry方法获取条目对应的文件或目录入口对象，并调用handleEntry函数进行处理
                handleEntry(item.webkitGetAsEntry());
            }
        }
    }

    // 定义函数loadItemList，用于加载给定的DataTransferItemList中的文件信息
    // 参数items是要加载的DataTransferItemList，它包含了通过拖放等操作传递过来的文件相关条目
    loadItemList(items: DataTransferItemList, callbackFun: (file: File) => void) {
        // 调用this对象的getFilesFromItemList函数来处理DataTransferItemList中的文件和目录信息
        // 当getFilesFromItemList处理完成后，会通过回调函数将获取到的文件数组和文件映射传递回来
        // 这里将获取到的文件和文件映射作为参数传递给loadFiles函数进行进一步处理
        this.getFilesFromItemList(items, (files, filesMap) => {
            this.loadFiles(files, callbackFun, filesMap);
        });
    }

    // 定义函数loadFiles，用于加载给定的文件数组以及可选的文件映射中的文件信息
    // 参数files是要加载的文件数组，每个元素都是一个File对象
    // 参数filesMap是一个可选的文件路径到文件对象的映射，用于更方便地根据路径查找文件
    loadFiles(files: Array<File>, callbackFun: (file: File) => void, filesMap?: Map<string, File>) {
        // 定义内部函数getMap，用于创建一个以文件名称为键，文件对象为值的新映射
        const getMap = () => {
            // 创建一个新的空映射
            const map = new Map<string, File>();
            // 遍历给定的文件数组
            for (let i = 0; i < files.length; i++) {
                // 获取当前遍历到的文件对象
                const file = files[i];
                // 将文件的名称作为键，文件对象本身作为值，添加到映射map中
                map.set(file.name, file);
            }
            // 返回创建好的映射
            return map;
        }

        // 如果给定的文件数组长度大于0，说明有文件需要处理
        if (files.length > 0) {
            // 如果传入了filesMap参数，则使用传入的文件映射；否则调用getMap函数创建一个新的文件映射
            const map = filesMap ?? getMap();
            // 打印当前的文件映射，这里可能是用于调试目的，查看文件映射的内容

            // 遍历文件映射中的每个键值对
            for (const [value, mapElement] of map) {
                // 调用this对象的loadFile函数来加载当前遍历到的文件对象
                // callbackFun(mapElement);
                this.loadDragFile(mapElement);
            }
        }
    }

    formatNumber(number: number) {
        return new Intl.NumberFormat('en-us', {useGrouping: true}).format(number);
    }

    /**
     * 加载拖放的文件
     * @param file 文件
     * @param manager
     */
    loadDragFile(file: File, manager?: any) {
        const filename = file.name;
        const splitArray = filename.split('.')

        const extension = splitArray.pop()?.toLowerCase()

        switch (extension) {
            case "gltf":
            case 'glb':
                const asset = new Asset({
                    name: filename,
                    file: file,
                    extension: extension
                })
                this.loadGltf(asset).then(gltf => {
                    this.editor.addObjectExecute(gltf);
                })
                break;
        }
    }

    //------------------------- 离线文件加载 结束 -------------------
}
