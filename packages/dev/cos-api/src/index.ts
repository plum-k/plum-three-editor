import COS, {BucketParams} from "cos-js-sdk-v5";

export interface COSApiResponse {
    statusCode: number;
    headers: {
        "content-length": string;
        etag: string;
        "x-cos-request-id": string;
    };
    Location: string;
    ETag: string;
    RequestId: string;
}

export default class COSApi {

    baseCosConfig = {
        Bucket: "plum-1257591271",
        Region: "ap-shanghai",
    }
    private cos: COS;

    constructor(options: BucketParams) {
        this.baseCosConfig = Object.assign({}, options)
        this.cos = new COS({
            SecretId: "AKIDXBoPwKvPl6cccUSKB0kQ3b6Wr8czYOFE", // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
            SecretKey: 'pfP7siXKD1lcm3aTVSSasEb5NfhcqK1q', // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
        });
    }

    uploadFile(value: {
        Body?: any,
        Key: string;
    }): Promise<COS.UploadFileResult> {
        const {Body, Key} = value
        return new Promise((resolve, reject) => {
            this.cos.uploadFile({
                ...this.baseCosConfig,
                Key: Key,
                Body: Body,
                onProgress: (progressData) => {
                    console.log(JSON.stringify(progressData));
                }
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err)
            })
        })
    }

    getBucket(value: {
        Prefix: string,
        // "/"
        Delimiter: string
    }): Promise<Array<unknown>> {
        const {Prefix, Delimiter} = value
        return new Promise((resolve, reject) => {
            this.cos.getBucket({
                ...this.baseCosConfig,
                Prefix: Prefix,
                Delimiter: Delimiter
            }).then((data) => {
                // let list: Array<IFolder> = []
                let list = []
                // const {Contents, CommonPrefixes} = data;
                // for (let i = 0; i < CommonPrefixes.length; i++) {
                //     const CommonPrefixe = CommonPrefixes[i];
                //     let node = {
                //         name: CommonPrefixe.Prefix,
                //         type: EFolder.FOLDER
                //     }
                //     list.push(node);
                // }
                // for (let i = 0; i < Contents.length; i++) {
                //     const Content = Contents[i];
                //     let node = {
                //         name: Content.Key,
                //         type: EFolder.FILE
                //     }
                //     list.push(node);
                // }
                resolve(list);
            }).catch((err) => {
                reject(err)
            })
        })
    }

    // 对象是否存在
    headObject(Key: string) {
        return this.cos.headObject({
            ...this.baseCosConfig,
            Key: Key,
        });
    }

    getObject(params: Partial<COS.GetObjectParams>) {
        return this.cos.getObject(<COS.GetObjectParams>{
            ...this.baseCosConfig,
            ...params
        });
    }


    getObjectUrl(Key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.cos.getObjectUrl(
                {
                    ...this.baseCosConfig,
                    Key: Key,
                },
                (err, data) => {
                    if (err) return console.log(err);
                    const url = data.Url;
                    resolve(url);
                }
            );
        })
    }
}