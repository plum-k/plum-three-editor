import JSZip from "jszip"; // 导入 JSZip 用于处理 zip 文件
import {isArray, isString} from "lodash-es"; // 导入 lodash 的工具函数
import {unZipObject} from "./unZipObject"; // 导入解压对象的函数
import {zipObject} from "./zipObject"; // 导入压缩对象的函数
import {SerializeInterface,} from "./SerializeInterface"; // 导入类型和接口
import {Subject} from "rxjs"; // 导入 RxJS 的 Subject 用于响应式编程

// 定义源数据的接口
export interface SourceData {
    name: string; // 数据项的名称
    json?: string; // JSON 数据，作为字符串（可选）
    texture?: string | ArrayBuffer; // 纹理数据（可以是字符串或 ArrayBuffer）
    geometry?: string; // 几何数据，作为字符串（可选）
    drawing?: string; // 绘图数据，作为字符串（可选）
}

// 定义类型数组的字典
export const TYPED_ARRAYS = {
    "Int8Array": Int8Array,
    "Uint8Array": Uint8Array,
    "Uint8ClampedArray": Uint8ClampedArray,
    "Int16Array": Int16Array,
    "Uint16Array": Uint16Array,
    "Int32Array": Int32Array,
    "Uint32Array": Uint32Array,
    "Float32Array": Float32Array,
    "Float64Array": Float64Array
};

// 定义 Base64 类型与其扩展名的映射字典
export const BASE64_TYPES = {
    "data:image/png;base64": "png",
    "data:image/jpeg;base64": "jpg",
    "data:image/gif;base64": "gif",
    "data:image/x-icon;base64": "ico",
    "data:image/svg+xml;base64": "svg",
    "data:image/webp;base64": "webp",
    "data:audio/wav;base64": "wav",
    "data:audio/mpeg;base64": "mp3",
    "data:video/mp4;base64": "mp4",
    "data:video/webm;base64": "webm",
    "data:font/woff;base64": "woff",
    "data:font/woff2;base64": "woff2",
    "data:application/vnd.ms-fontobject;base64": "eot",
    "data:application/x-font-ttf;base64": "ttf",
    "data:application/octet-stream;base64": "ttf",
    "data:application/font-woff;base64": "woff",
    "data:application/font-woff2;base64": "woff2"
}

// 主序列化类，用于处理数据的序列化和反序列化
export class Serialize {
    packSubject = new Subject<Blob>(); // 创建主题，用于发布打包后的 Blob 数据
    private jszip: JSZip; // JSZip 实例，用于创建和操作 zip 文件
    private imgFolder: JSZip; // 图像文件夹
    private drawingFolder: JSZip; // 绘图文件夹
    private geometriesFolder: JSZip; // 几何数据文件夹

    constructor() {
        this.jszip = new JSZip(); // 初始化 JSZip 实例
        this.imgFolder = this.jszip.folder("Textures") as JSZip; // 创建纹理文件夹
        this.drawingFolder = this.jszip.folder("Drawing") as JSZip; // 创建绘图文件夹
        this.geometriesFolder = this.jszip.folder("Geometries") as JSZip; // 创建几何数据文件夹
    }

    // 开始打包
    public async pack(viewerJson: SerializeInterface.Viewer) {
        let esData: SourceData[] = []; // 存储源数据的数组
        const sceneJson = viewerJson.scene; // 获取场景 JSON

        // 将所有贴图取出并单独存储
        if (sceneJson.images) {
            const images = sceneJson.images.map((item) => {

                if (isString(item.url)) {
                    // 处理普通图片
                    const name = item.uuid + `.${Reflect.get(BASE64_TYPES, item.url.split(",")[0])}`; // 获取文件名
                    const content = item.url; // 获取内容
                    esData.push({name, texture: content}); // 添加到源数据数组
                    return name;
                }

                // 处理 DataTexture 类型的贴图
                // @ts-ignore
                const name = `${item.url.type}!${item.url.width}!${item.url.height}!${item.uuid}.env`; // 生成文件名
                const buffer = Reflect.get(TYPED_ARRAYS, item.url.type)(item.url.data); // 获取类型数组
                esData.push({name, texture: buffer.buffer}); // 添加到源数据数组
                return name;
            });
            Reflect.set(sceneJson, "images", images); // 更新场景的图片信息
        }

        // 将所有几何数据取出并单独存储
        if (sceneJson.geometries) {

            // 为避免数据量过大超过 V8 引擎对于字符串的限制，分为多个切片（10 个几何数据为一组）
            const transferNum = Math.ceil(sceneJson.geometries.length / 10); // 计算切片数量
            for (let i = 0; i < transferNum; i++) {
                const name = `geometries_${i}.json`; // 生成文件名
                const geometry = JSON.stringify(this.handleGeometryJson(sceneJson.geometries.slice(i * 10, (i + 1) * 10), true)); // 处理几何数据并转换为 JSON
                esData.push({name, geometry}); // 添加到源数据数组
            }
            sceneJson.geometries = []; // 清空原几何数据
        }

        // 添加场景 JSON 到源数据
        esData.push({name: "scene.json", json: JSON.stringify(viewerJson)});
        return this.zip(esData); // 执行 zip 操作
    }

    // 解压缩操作
    public async unpack(file: Blob) {
        const zip = new JSZip(); // 创建新的 JSZip 实例
        let viewerJson; // 存储解压后的场景 JSON
        let drawingInfo = {
            imgSrc: "", // 存储图纸的图片源
            markList: [], // 存储标记列表
            imgInfo: {} // 存储图片信息
        };
        // 纹理映射表
        let textureMap = new Map<string, string | object>();
        // 几何数据数组
        let geometries: Array<any> = [];

        const res = await zip.loadAsync(file); // 加载 zip 文件
        /**
         * res.files 包含整个 zip 里的文件描述、目录描述列表
         * res 本身就是 JSZip 的实例
         */
        for (let key in res.files) {
            // 判断是否是目录
            if (!res.files[key].dir) {
                // 找到我们压缩包所需要的 json 文件
                if (res.files[key].name === "scene.json") {
                    const content = await res.file(res.files[key].name)?.async('string') as string; // 获取 scene.json 文件的内容
                    viewerJson = JSON.parse(content); // 解析 JSON
                } else if (res.files[key].name.substring(0, 9) === "Textures/") {
                    /**
                     * 处理贴图
                     * 分为两种情况：
                     * 1. 贴图为 env 格式（type!width!height!uuid.env），转换为 ArrayBuffer 格式，存入 map
                     * 2. 贴图为普通图片格式，直接存入 map
                     **/
                    if (/\.env$/.test(res.files[key].name)) {
                        // 转换回贴图原始信息，存入 map
                        const content = await res.file(res.files[key].name)?.async('arraybuffer') as ArrayBuffer;
                        const filedArr = res.files[key].name.replace("Textures/", "").split("!");
                        textureMap.set(filedArr[3], content); // 存储 ArrayBuffer
                    } else {
                        const content = await res.file(res.files[key].name)?.async('string') as string;
                        textureMap.set(res.files[key].name.replace("Textures/", ""), content); // 存储图片字符串
                    }
                } else if (/^Geometries\/geometries_\d*\.zip$/.test(res.files[key].name)) {
                    // 处理几何切片 zip 包，内部是 JSON 文件
                    const content = await res.file(res.files[key].name)?.async('blob') as Blob;
                    const zip = new JSZip(); // 创建新的 JSZip 实例
                    const zipRes = await zip.loadAsync(content); // 加载几何 zip 内容
                    for (let zipKey in zipRes.files) {
                        const content = await zip.file(zipRes.files[zipKey].name)?.async('string') as string;
                        geometries.push(...this.handleGeometryJson(JSON.parse(content), false)); // 处理并添加几何数据
                    }
                } else if (res.files[key].name.substring(0, 8) === "Drawing/") {
                    /**
                     * 处理图纸文件夹下的文件
                     * 1. drawingMarking.txt 为图纸标注文件，须解压
                     * 2. sceneId 开头的图片是图纸
                     */
                    if (res.files[key].name === "Drawing/drawingMark.txt") {
                        const content = await res.file(res.files[key].name)?.async('string') as string;
                        drawingInfo.markList = unZipObject(content); // 解压标注文件
                    } else if (res.files[key].name === "Drawing/drawingImgInfo.json") {
                        drawingInfo.imgInfo = JSON.parse(await res.file(res.files[key].name)?.async('string') as string); // 解析图片信息
                    } else {
                        drawingInfo.imgSrc = await res.file(res.files[key].name)?.async('string') as string; // 获取图片源
                    }
                }
            }
        }

        // 还原纹理至 sceneJson
        viewerJson.scene.images = viewerJson.scene.images.map((item: string) => {
            const nameSplit = item.split(".");
            if (nameSplit[1] === "env") {
                const urlSplit = nameSplit[0].split("!");
                return {
                    uuid: urlSplit[3],
                    url: {
                        type: urlSplit[0],
                        width: parseInt(urlSplit[1]),
                        height: parseInt(urlSplit[2]),
                        /**
                         * sceneJson 在打 zip 包前原数据为 Array，此处解压后使用 ArrayBuffer，不还原为 Array
                         * 还原为 Array 这样写 Array.from(new TYPED_ARRAYS[urlSplit[0]](textureMap.get(urlSplit[3] + ".env")))
                         **/
                        data: textureMap.get(urlSplit[3] + ".env") // 获取 ArrayBuffer
                    }
                };
            } else {
                return {
                    uuid: nameSplit[0],
                    url: textureMap.get(item) // 获取普通图片的 URL
                };
            }
        });

        textureMap.clear(); // 清空纹理映射表

        // 还原几何数据至 sceneJson
        viewerJson.scene.geometries = geometries;

        // 还原图纸信息至 sceneJson
        if (drawingInfo.imgSrc !== "") viewerJson.drawingInfo = drawingInfo;

        return viewerJson; // 返回还原后的 viewerJson
    }

    // 处理几何数据的 JSON
    private handleGeometryJson(arr: Array<SerializeInterface.Geometry>, isZip: boolean) {
        // 根据 isZip 的值决定使用的处理函数
        function zipHandler(value: SerializeInterface.GeometryAttributesItem.array) {
            if (isArray(value)) {
                return zipObject(value, false); // 压缩对象
            }
            return value; // 返回原值
        }

        function unZIpHandler(value: any) {
            if (typeof value === "string") {
                return unZipObject(value, false); // 解压对象
            }
            return value; // 返回原值
        }

        let handler = isZip ? zipHandler : unZIpHandler; // 确定使用哪个处理器

        // 遍历几何数据数组，处理每个几何对象
        return arr.map((geometry) => {
            if (geometry.data) {
                const data = geometry.data; // 获取几何数据
                if (data.attributes) {
                    for (let key in data.attributes) {
                        data.attributes[key].array = handler(data.attributes[key].array); // 处理属性数组
                    }
                }
                if (data.index) {
                    data.index.array = handler(data.index.array); // 处理索引数组
                }
            }
            return geometry; // 返回处理后的几何对象
        });
    }

    // 压缩源数据
    private async zip(sourceData: SourceData[]): Promise<Blob> {
        let geometryData: SourceData[] = []; // 存储几何数据的数组
        sourceData.forEach((item) => {
            if (item.texture) {
                // 处理纹理数据
                this.imgFolder.file(item.name, item.texture, {
                    compression: "DEFLATE", // 使用 DEFLATE 压缩
                    compressionOptions: {
                        level: 9 // 设置压缩等级
                    }
                });
            } else if (item.geometry) {
                geometryData.push(item); // 收集几何数据
            } else if (item.json) {
                // 处理 JSON 数据
                this.jszip.file(item.name, item.json, {
                    compression: "DEFLATE", // 使用 DEFLATE 压缩
                    compressionOptions: {
                        level: 9 // 设置压缩等级
                    }
                });
            } else if (item.drawing) {
                // 处理绘图数据
                this.drawingFolder.file(item.name, item.drawing, {
                    compression: "DEFLATE", // 使用 DEFLATE 压缩
                    compressionOptions: {
                        level: 9 // 设置压缩等级
                    }
                });
            }
        });

        // 如果有几何数据，进行打包
        if (geometryData.length > 0) {
            await this.zipGeometry(geometryData);
        }

        // 生成最终的 Blob 数据
        const content = await this.jszip.generateAsync({type: 'blob'});
        this.packSubject.next(content); // 发布打包后的内容
        return new Promise((resolve, reject) => {
            resolve(content);
        });
    }

    /**
     * 几何数据切片打包
     */
    private async zipGeometry(geometryData: Array<SourceData>) {
        // 将几何数据按 10 个一组分割为新数组
        const geometryDataArray: Array<Array<SourceData>> = [];
        for (let i = 0; i < geometryData.length; i += 10) {
            geometryDataArray.push(geometryData.slice(i, i + 10)); // 切片
        }

        // 逐个打包
        for (let i = 0; i < geometryDataArray.length; i++) {
            const jszip = new JSZip(); // 创建新的 JSZip 实例
            geometryDataArray[i].forEach(item => {
                jszip.file(item.name, item.geometry!, {
                    compression: "DEFLATE", // 使用 DEFLATE 压缩
                    compressionOptions: {
                        level: 9 // 设置压缩等级
                    }
                });
            });
            const zip = await jszip.generateAsync({type: 'blob'}); // 生成 zip Blob
            this.geometriesFolder.file(`geometries_${i}.zip`, zip, {
                compression: "DEFLATE", // 使用 DEFLATE 压缩
                compressionOptions: {
                    level: 9 // 设置压缩等级
                }
            });
        }
    }
}