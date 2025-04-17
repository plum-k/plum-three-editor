import pako from "pako";
import {decode} from 'js-base64';

// 解压
export const unZipObject = (base64Data: string, needDecode = true) => {
    // 1. 使用 atob() 方法将 Base64 编码的字符串解码为普通字符串
    let strData = atob(base64Data);

    // 2. 将解码后的字符串转换为数组,每个元素是字符的 charCodeAt 值
    let charData = strData.split('').map(function (x) {
        return x.charCodeAt(0);
    });

    // 3. 创建一个 Uint8Array 并将上一步得到的数组赋值给它
    let binData = new Uint8Array(charData);

    // 4. 使用 pako 库对二进制数据进行解压缩
    let data = pako.ungzip(binData);

    // 5. 切片处理数据,防止内存溢出报错
    let str = '';
    const chunk = 8 * 1024 // 每次处理 8KB 的数据
    let i;
    for (i = 0; i < data.length / chunk; i++) {
        str += String.fromCharCode.apply(null, (data.slice(i * chunk, (i + 1) * chunk) as unknown as Array<number>));
    }
    str += String.fromCharCode.apply(null, (data.slice(i * chunk) as unknown as Array<number>));

    // 6. 如果需要解码,则使用 decode 函数对字符串进行解码
    const unzipStr = needDecode ? decode(str) : str;

    // 7. 尝试将解压缩后的字符串转换为 JSON 对象
    let result;
    try {
        result = JSON.parse(unzipStr)
    } catch (error) {
        // 如果转换失败,说明值为基本数据类型,直接赋值
        if (/Unexpected token o in JSON at position 0/.test(error as string)) {
            result = unzipStr
        }
    }

    // 8. 返回解压缩后的数据
    return result
}


