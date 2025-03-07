/**
 * 资产类，用于管理资源的加载和存储。
 * 提供了加载进度的观察者模式，以及基于URL自动解析资源名称和扩展名的功能。
 */
import {Subject} from "rxjs";
import {isArray, isNil, split} from "lodash-es";
import {extractFileNameAndExtension, isUrl} from "../../tool";

/**
 * 资产接口，定义了资产的属性。
 */
export interface IAsset {
    loadUrl?: string | Array<string>; // 资源的URL
    result?: ArrayBuffer | object | undefined; // 加载完成的资源数据
    name?: string; // 资源的名称
    file?: File
    extension?: string; // 资源的文件扩展名
}


/**
 * 资产类，用于管理单个资产的加载和存储。
 */
export class Asset{
    options: IAsset; // 资产选项，包含了初始化时的所有可能属性
    url: string | undefined; // 资源的URL
    result: ArrayBuffer | undefined; // 加载完成的资源数据
    name!: string; // 资源的名称
    extension!: string; // 资源的文件扩展名
    loadSubject = new Subject<unknown>(); // 加载完成的观察者主题，用于通知加载的GLTF资源
    errorSubject = new Subject<unknown>(); // 加载完成的观察者主题，用于通知加载的GLTF资源

    progressSubject = new Subject<number>(); // 加载进度的观察者主题，用于通知加载进度

    fileReader: FileReader | undefined
    file: File | undefined

    /**
     * 构造函数，初始化资产类的实例。
     * @param options 资产的配置选项，包含了初始时的URL、结果数据、名称和扩展名。
     */
    constructor(options: IAsset) {
        this.options = options;
        // 如果提供了URL，则尝试解析资源的名称和扩展名
        if (!isNil(this.options.loadUrl)) {
            // @ts-ignore
            this.url = this.options.loadUrl;
            let urlExtension = isArray(this.url) ? this.url[0] : this.url;
            // todo 用 query-string 代替
            const _isUrl = isUrl(urlExtension);
            if (_isUrl) {
                const _url = new URL(urlExtension);
                urlExtension = _url.pathname;
            }

            const splitList = split(urlExtension, ".");
            const len = splitList.length
            this.name = splitList[len - 2]
            this.extension = splitList[len - 1]
            if (_isUrl) {
                this.name = decodeURIComponent(this.name)
            }
        }
        // 如果提供了结果数据，则直接赋值
        if (!isNil(this.options.result)) {
            // @ts-ignore
            this.result = this.options.result;
        }
        // 如果提供了名称或扩展名，则直接赋值
        if (!isNil(this.options.name)) {
            this.name = this.options.name;
        }
        if (!isNil(this.options.extension)) {
            this.extension = this.options.extension;
        }
        this.parseFile()
        // 确保必须提供扩展名
        if (isNil(this.extension)) {
            throw new Error("请传入文件后缀类型")
        }
    }

    parseFile() {
        if (!isNil(this.options.file)) {
            this.file = this.options.file
            this.fileReader = new FileReader();
            let [fileName, fileExtension] = extractFileNameAndExtension(this.file);
            this.name = fileName;
            this.extension = fileExtension;
        }
    }

    onLoad = (data: unknown) => {
        this.loadSubject.next(data);
    }

    onProgress = (event: ProgressEvent) => {
        const progress = Math.floor((event.loaded / event.total) * 100)
        this.progressSubject.next(progress)
    }
    onError = (err: unknown) => {
        this.errorSubject.error(err);
    }

    loadFile = (loadFun: (event: ProgressEvent<FileReader>) => void) => {
        if (!this.fileReader) return;
        if (!this.file) return;
        this.fileReader.addEventListener('progress', (event) => {
            // const size = '(' + this.formatNumber(Math.floor(event.total / 1000)) + ' KB)';
            const progress = Math.floor((event.loaded / event.total) * 100)
            this.progressSubject.next(progress)
        });
        this.fileReader.addEventListener('load', async (event) => {
            loadFun(event);
        });
        this.fileReader.readAsArrayBuffer(this.file);
    }
}
