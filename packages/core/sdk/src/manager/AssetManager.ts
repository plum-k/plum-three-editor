import {isNil, isString} from "lodash-es";
import {
    AudioLoader,
    CubeTextureLoader,
    FileLoader,
    Group,
    Loader,
    LoadingManager,
    ObjectLoader,
    Texture,
    TextureLoader
} from "three";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import Asset from "../core/asset/Asset";
import {IModuleOptions, Module} from "../core/Module";
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
import {GltfModelAsset} from "../core/asset/GltfModelAsset";
import {TextureAsset} from "../core/asset/TextureAsset";
import {KTX2Loader} from "three/examples/jsm/loaders/KTX2Loader";

export interface IResourceManagers extends IModuleOptions {
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

export class AssetManager extends Module {
    loadingManager: LoadingManager;
    dracoLoader!: DRACOLoader;
    sdkUrl: string = "";
    gLTFLoader!: GLTFLoader;
    textureLoader!: TextureLoader;
    kTX2Loader!: KTX2Loader;

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

        this.textureLoader = new TextureLoader();
        this.memoizedLoaders.set(TextureLoader, this.textureLoader)

        this.kTX2Loader = new KTX2Loader();
        this.kTX2Loader.setTranscoderPath(`${this.sdkUrl}/libs/basis/`);
        this.kTX2Loader.detectSupport(this.viewer.renderManager.defaultWebGLRenderer);
        this.memoizedLoaders.set(KTX2Loader, this.kTX2Loader)

        const gLTFLoader = new GLTFLoader(this.loadingManager);
        gLTFLoader.setDRACOLoader(this.dracoLoader);
        gLTFLoader.setKTX2Loader(this.kTX2Loader);
        this.memoizedLoaders.set(GLTFLoader, gLTFLoader)

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

        })
    }

    // 拖动事件
    dragHandler(event: DragEvent) {

        const items = event.dataTransfer!.items
        const files = event.dataTransfer!.files;
        if (items) {
            this.loadItemList(items, this.loadFile)
        } else {
            this.loadFiles(files as unknown as Array<File>, this.loadFile)
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
                this.loadFile(mapElement);
            }
        }
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
            case 'glb':
                const asset = new GltfModelAsset({
                    name: filename,
                    file: file,
                    extension: extension
                })
                this.loadGltf(asset).then(gltf => {
                    this.scene.add(gltf as unknown as Group)
                    this.editor.editorEventManager.sceneGraphChanged.next(null);
                })
                break;
        }
    }

    //------------------------- 离线文件加载 结束 -------------------
}
