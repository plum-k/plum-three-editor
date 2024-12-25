import React, {useEffect} from "react";
import * as THREE from "three";
import {Button, Dropdown, MenuProps} from "antd";
import MenuItem from "./MenuItem.tsx";
import {useViewer} from "../../store/useStore.ts";

const AddMenu: React.FC = () => {
    const viewer = useViewer()
    useEffect(() => {
    }, [viewer])
    const HandleClick = (name: string) => {
        console.log(name)
        switch (name) {
            case "group":
                const group = new THREE.Group();
                group.name = "Group";
                viewer?.editor.addObjectExecute(group);
                break;
            case "plane":
                const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
                const material = new THREE.MeshStandardMaterial();
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = 'Plane';
                viewer?.editor.addObjectExecute(mesh);
                break;
            case "box":
                const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
                const boxMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const box = new THREE.Mesh(boxGeometry, boxMaterial);
                box.name = "Box";
                viewer?.editor.addObjectExecute(box);
                break;
            case "capsule":
                const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 1, 8, 8);
                const capsuleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
                capsule.name = "Capsule";
                viewer?.editor.addObjectExecute(capsule);
                break;
            case "circle":
                const circleGeometry = new THREE.CircleGeometry(0.5, 32);
                const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const circle = new THREE.Mesh(circleGeometry, circleMaterial);
                circle.name = "Circle";
                viewer?.editor.addObjectExecute(circle);
                break;
            case "cylinder":
                const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
                const cylinderMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
                cylinder.name = "Cylinder";
                viewer?.editor.addObjectExecute(cylinder);
                break;
            case "ring":
                const ringGeometry = new THREE.RingGeometry(0.5, 1, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.name = "Ring";
                viewer?.editor.addObjectExecute(ring);
                break;
            case "sphere":
                const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.name = "Sphere";
                viewer?.editor.addObjectExecute(sphere);
                break;
            case "dodecahedron":
                const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.5);
                const dodecahedronMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
                dodecahedron.name = "Dodecahedron";
                viewer?.editor.addObjectExecute(dodecahedron);
                break;
            case "icosahedron":
                const icosahedronGeometry = new THREE.IcosahedronGeometry(0.5);
                const icosahedronMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
                icosahedron.name = "Icosahedron";
                viewer?.editor.addObjectExecute(icosahedron);
                break;
            case "octahedron":
                const octahedronGeometry = new THREE.OctahedronGeometry(0.5);
                const octahedronMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
                octahedron.name = "Octahedron";
                viewer?.editor.addObjectExecute(octahedron);
                break;
            case "tetrahedron":
                const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.5);
                const tetrahedronMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
                tetrahedron.name = "Tetrahedron";
                viewer?.editor.addObjectExecute
                (tetrahedron);
                break;
            case "torus":
                const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32);
                const torusMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const torus = new THREE.Mesh(torusGeometry, torusMaterial);
                torus.name = "Torus";
                viewer?.editor.addObjectExecute(torus);
                break;
            case "torusknot":
                const torusKnotGeometry = new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8);
                const torusKnotMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
                torusKnot.name = "TorusKnot";
                viewer?.editor.addObjectExecute(torusKnot);
                break;
            case "tube":
                const tubeGeometry = new THREE.TubeGeometry(
                    new THREE.CatmullRomCurve3([
                        new THREE.Vector3(-1, 0, 0),
                        new THREE.Vector3(-0.5, 1, 0),
                        new THREE.Vector3(0.5, 1, 0),
                        new THREE.Vector3(1, 0, 0)
                    ]),
                    64,
                    0.2,
                    8,
                    false
                );
                const tubeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                tube.name = "Tube";
                viewer?.editor.addObjectExecute(tube);
                break;
            case "lathe":
                const points = [];
                for (let i = 0; i < 10; i++) {
                    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
                }
                const latheGeometry = new THREE.LatheGeometry(points);
                const latheMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const lathe = new THREE.Mesh(latheGeometry, latheMaterial);
                lathe.name = "Lathe";
                viewer?.editor.addObjectExecute(lathe);
                break;
            case "sprite":
                const spriteMaterial = new THREE.SpriteMaterial({color: 0xffffff});
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.name = "Sprite";
                viewer?.editor.addObjectExecute(sprite);
                break;
            case "AmbientLight":
                const ambientLight = new THREE.AmbientLight(0x404040);
                ambientLight.name = "AmbientLight";
                viewer?.editor.addObjectExecute(ambientLight);
                break;
            case "PointLight":
                const pointLight = new THREE.PointLight(0xffffff);
                pointLight.position.set(0, 2, 2);
                pointLight.name = "PointLight";
                viewer?.editor.addObjectExecute(pointLight);
                break;
            case "SpotLight":
                const spotLight = new THREE.SpotLight(0xffffff);
                spotLight.position.set(2, 2, 2);
                spotLight.angle = Math.PI / 6;
                spotLight.penumbra = 0.5;
                spotLight.name = "SpotLight";
                viewer?.editor.addObjectExecute(spotLight);
                break;
            case "DirectionalLight":
                const directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(1, 2, 1);
                directionalLight.name = "DirectionalLight";
                viewer?.editor.addObjectExecute(directionalLight);
                break;
            case "hemisphereLight":
                const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
                hemisphereLight.position.set(0, 2, 0);
                hemisphereLight.name = "HemisphereLight";
                viewer?.editor.addObjectExecute(hemisphereLight);
                break;
            default:
                console.log(`Unknown geometry type: ${name}`);
                break;
        }
    }
    const meshItems: MenuProps['items'] = [
        {
            key: 'plane',
            label: (
                <MenuItem name={'平面'} onClick={() => HandleClick('plane')}/>
            )
        },
        {
            key: 'box',
            label: (
                <MenuItem name={'正方体'} onClick={() => HandleClick('box')}/>
            )
        },
        {
            key: 'capsule',
            label: (
                <MenuItem name={'胶囊'} onClick={() => HandleClick('capsule')}/>
            )
        },
        {
            key: 'circle',
            label: (
                <MenuItem name={'圆'} onClick={() => HandleClick('circle')}/>
            )
        },
        {
            key: 'cylinder',
            label: (
                <MenuItem name={'圆柱体'} onClick={() => HandleClick('cylinder')}/>
            )
        },
        {
            key: 'ring',
            label: (
                <MenuItem name={'环'} onClick={() => HandleClick('ring')}/>
            )
        },
        {
            key: 'sphere',
            label: (
                <MenuItem name={'球体'} onClick={() => HandleClick('sphere')}/>
            )
        },
        {
            key: 'dodecahedron',
            label: (
                <MenuItem name={'十二面体'} onClick={() => HandleClick('dodecahedron')}/>
            )
        },
        {
            key: 'icosahedron',
            label: (
                <MenuItem name={'二十面体'} onClick={() => HandleClick('icosahedron')}/>
            )
        },
        {
            key: 'octahedron',
            label: (
                <MenuItem name={'八面体'} onClick={() => HandleClick('octahedron')}/>
            )
        },
        {
            key: 'tetrahedron',
            label: (
                <MenuItem name={'四面体'} onClick={() => HandleClick('tetrahedron')}/>
            )
        },
        {
            key: 'torus',
            label: (
                <MenuItem name={'圆环体'} onClick={() => HandleClick('torus')}/>
            )
        },
        {
            key: 'torusknot',
            label: (
                <MenuItem name={'环面纽结体'} onClick={() => HandleClick('torusknot')}/>
            )
        },
        {
            key: 'tube',
            label: (
                <MenuItem name={'管'} onClick={() => HandleClick('tube')}/>
            )
        },
        {
            key: 'lathe',
            label: (
                <MenuItem name={'酒杯'} onClick={() => HandleClick('lathe')}/>
            )
        },
        {
            key: 'sprite',
            label: (
                <MenuItem name={'精灵'} onClick={() => HandleClick('sprite')}/>
            )
        }
    ];
    const lightItems: MenuProps['items'] = [
        {
            key: 'AmbientLight',
            label: (
                <MenuItem name={'环境光'} onClick={() => HandleClick('AmbientLight')}/>
            )
        },
        {
            key: 'DirectionalLight',
            label: (
                <MenuItem name={'平行光'} onClick={() => HandleClick('DirectionalLight')}/>
            )
        },
        {
            key: 'HemisphereLight',
            label: (
                <MenuItem name={'半球光'} onClick={() => HandleClick('HemisphereLight')}/>
            )
        },
        {
            key: 'PointLight',
            label: (
                <MenuItem name={'点光源'} onClick={() => HandleClick('PointLight')}/>
            )
        },
        {
            key: 'SpotLight',
            label: (
                <MenuItem name={'聚光灯'} onClick={() => HandleClick('SpotLight')}/>
            )
        }
    ];
    const items = [
        {
            key: 'group',
            label: (
                <MenuItem name={'组'} onClick={() => HandleClick('group')}/>
            )
        },
        {
            key: 'mesh',
            label: (
                <MenuItem name={'网格'}/>
            ),
            children: meshItems
        },
        {
            key: 'light',
            label: (
                <MenuItem name={'灯光'}/>
            ),
            children: lightItems
        }
    ];
    return (
        <Dropdown menu={{items}} trigger={["click"]}
                  overlayClassName={'plum-menu-dropDown'} placement="bottomLeft">
            <Button type="text">添加</Button>
        </Dropdown>
    )
}

export default AddMenu;
