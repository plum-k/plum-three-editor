import {IOssApiOptions} from "@plum-render/oss-api";
import {Color} from "three";

export interface IViewerOptions {
    /**
     * 应用程序的唯一标识符。
     */
    appId?: string;

    /**
     * 资源包的路径，用于加载相关资源。
     */
    packagePath?: string;

    /**
     * 基础路径
     */
    ossBaseUrl?: string;
    /**
     * 包的类型
     * - "part": 渐进式加载
     * - "chunk": 切片包
     * - "native": 原生包
     */
    packageType?: "part" | "chunk" | "native";
    /**
     * cos 配置
     */
    ossApiOptions?: IOssApiOptions;

    /**
     * 是否创建默认光源，默认为 false。
     */
    isCreateDefaultLight?: boolean;

    /**
     * 是否创建默认环境，默认为 false。
     */
    isCreateDefaultEnvironment?: boolean;
    /**
     * 显示小控件
     */
    isCubeGizmo?: boolean;
    isSphereGizmo?: boolean;
    scene?: {
        background?: Color
    },
}