import {Component, IComponentOptions} from "../../component/Component";

export interface IPackageOptions extends IComponentOptions {
}


/**
 * 序列化和反序列化场景
 */
export abstract class Package extends Component {

    static Type = "plumSceneSerializer";

    protected constructor(options: IPackageOptions) {
        super(options);
    }

    /**
     * 序列化场景
     */
    abstract pack(): Promise<void>

    /**
     * 反序列化场景
     */
    abstract unpack(blob: Blob): Promise<void>


    /**
     * 加载场景
     */
    abstract loadScene(): void
}



