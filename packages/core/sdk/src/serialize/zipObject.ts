import pako from "pako";
import {encode} from 'js-base64';
import {isNil, isString} from "lodash-es";

// 压缩
export const zipObject = (data: object, needEncode = true) => {
    // 如果 data 为空,直接返回
    if (isNil(data)) {
        return data
    }
    // 判断 data 是否为字符串,如果不是则将其转换为 JSON 字符串
    const dataJson: string = !isString(data) ? JSON.stringify(data) : data

    // btoa 不支持中文,使用 Base64 编码处理字符编码,以兼容中文
    const str = needEncode ? encode(dataJson) : dataJson;

    // 使用 pako 库对字符串进行 gzip 压缩
    let binaryString = pako.gzip(str);

    // 将压缩后的二进制数据转换为字符串
    let arr = Array.from(binaryString);
    let s = "";
    arr.forEach((item: number) => {
        s += String.fromCharCode(item)
    })
    return btoa(s)
}

