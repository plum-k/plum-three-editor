import {Group, Quaternion} from 'three';

export interface BillboardOptions {
    follow: boolean;
    lockX: boolean;
    lockY: boolean;
    lockZ: boolean;
    // 外层 的group
    group: Group;
}

const Billboard = (config: BillboardOptions) => {
    const {follow, lockX, lockY, lockZ, group} = config;

    // 在每帧循环中
    group.matrixAutoUpdate = false;
    group.matrixWorldAutoUpdate = false;
    //--------
    const q = new Quaternion();
    const prevRotation = group.rotation.clone();

    // Always face the camera
    group.updateMatrix();
    group.updateWorldMatrix(false, false);
    group.getWorldQuaternion(q);
    camera.getWorldQuaternion(q).premultiply(q.invert());

    // Readjust any axis that is locked
    if (lockX) group.rotation.x = prevRotation.x;
    if (lockY) group.rotation.y = prevRotation.y;
    if (lockZ) group.rotation.z = prevRotation.z;
}

export
Billboard;