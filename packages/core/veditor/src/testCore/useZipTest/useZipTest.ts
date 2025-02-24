import {isString,} from "lodash-es";
import {Viewer} from @plum-render/three-sdk";

export function getObjectSize(obj) {

    const sizeInBytes = new Blob([isString(obj) ? obj : JSON.stringify(obj)]).size; // 计算字节大小
    const sizeInMB = sizeInBytes / (1024 * 1024); // 转换为 MB
    console.log(`Object size: ${sizeInMB.toFixed(6)} MB`);
}

export default function useZipTest(viewer: Viewer) {
    // const input4 = {message: "你好，世界！"};
    // const result4 = zipObject(input4);
    // console.log(result4)
    // console.log(getObjectSize(input4))
    // console.log(unZipObject(result4))
    // viewer.editor.pack();
    // viewer.editor.serialize.packSubject.subscribe((value) => {

    // const zipFile = new File([value], `test.zip`, {type: "application/zip"});
    //
    // COSApi.uploadFile({
    //     Body: zipFile,
    //     Key: "test.zip",
    // }).then(res => {
    //     if (res.statusCode === 200) {
    //         const Location = res.Location;
    //         ApplicationApi.create({
    //             appName: "test",
    //             appType: "test",
    //             type: "test",
    //             resourcePath: Location,
    //             thumbnailBase64: "",
    //         }).then(res1 => {
    //             console.log(res1)
    //         })
    //     }
    //     console.log(res)
    //
    // })
    // viewer.editor.serialize.unpack(value).then(viewerJson => {
    //     console.log(viewerJson)
    // })
    // })
    // let json = viewer.editor.toJson();
    // console.log(json)
    // getObjectSize(json)
    //
    // const result41 = zipObject(json);
    // // console.log(result41)
    // getObjectSize(result41)
}