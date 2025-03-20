import {ESceneLoadType} from "./ESceneLoadType";

/**
 * 定义场景加载进度事件的接口
 */
export interface ISceneLoadProgressEvent {
    /**
     * 当前场景加载操作的类型，取值为 ISceneLoadType 枚举中的值
     */
    type: ESceneLoadType;
    /**
     * 操作的名称
     */
    name: string;
    /**
     * 场景加载任务的总工作量，可以是字节数、文件数量等，具体含义取决于加载类型
     */
    total: number;
    /**
     * 当前场景加载任务已经完成的工作量，与 total 采用相同的度量单位
     */
    loaded: number;
}