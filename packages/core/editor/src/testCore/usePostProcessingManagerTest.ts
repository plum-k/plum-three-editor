import {Viewer} from @plum-render/three-sdk";
import {BoxGeometry, ConeGeometry, Group, Mesh, MeshPhongMaterial, OctahedronGeometry, SphereGeometry} from "three";

export function create(amount = 30, range = 10.0) {

    const group = new Group();
    const PI2 = 2 * Math.PI;

    const geometries = [
        new BoxGeometry(1, 1, 1),
        new ConeGeometry(1, 1, 16),
        new OctahedronGeometry(),
        new SphereGeometry(1, 16, 16)
    ];

    for (let i = 0, j = 0, l = geometries.length; i < amount; ++i, j = ++j % l) {

        const material = new MeshPhongMaterial({
            color: 0xffffff * Math.random()
        });

        const mesh = new Mesh(geometries[j], material);
        mesh.rotation.set(Math.random() * PI2, Math.random() * PI2, Math.random() * PI2);
        mesh.scale.multiplyScalar(Math.random() + 0.75);

        const phi = Math.random() * PI2;
        const cosTheta = Math.random() * 2.0 - 1.0;
        const u = Math.random();

        const theta = Math.acos(cosTheta);
        const r = Math.cbrt(u) * range;

        mesh.position.set(
            r * Math.sin(theta) * Math.cos(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(theta)
        );

        group.add(mesh);

    }

    return group;

}

export default function usePostProcessingManagerTest(viewer: Viewer) {

    // viewer.postProcessingManager.addRenderPass();

    // viewer.postProcessingManager.initBloomEffect();
    // viewer.postProcessingManager.addBloomEffect();

    // viewer.postProcessingManager.initSelectiveBloomEffect();
    // viewer.postProcessingManager.addSelectiveBloomEffect();

    // viewer.postProcessingManager.initPixelationEffect();
    // viewer.postProcessingManager.addPixelationEffect();

    viewer.postProcessingManager.initEffectPass();
    // viewer.postProcessingManager.addEffectPass();

    // viewer.eventManager.leftClickPickSubject.subscribe((e) => {
    //     console.log(e)
    //     let c = viewer.postProcessingManager.addSelectiveBloomEffectObject(e.intersects[0].object);
    //     console.log(c)
    // })
    // const cloud = create();
    // cloud.scale.setScalar(0.4);
    // viewer.scene.add(cloud);

    // const a = viewer.scene.getObjectByName("球体")
    // console.log(a)


}