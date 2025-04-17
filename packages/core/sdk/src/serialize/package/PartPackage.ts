import {Uint8ArrayReader} from "@zip.js/zip.js";
import {IPackageOptions, Package} from "./Package";

export interface ISerializeSubject {
    blob: Blob;
    index: string;
    isEnd: boolean;
}

export interface ReaderInfo {
    index: number;
    reader: Uint8ArrayReader;
}

export interface IPartSerializeOptions extends IPackageOptions {
}

/**
 * 对场景进行分包序列化, 可以分片加载
 */
export class PartPackage extends Package {
    static Type = "PartPackage";

    loadScene(): void {
    }

    pack(): Promise<void> {

    }

    unpack(blob: Blob): Promise<void> {

    }

}