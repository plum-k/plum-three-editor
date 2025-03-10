import {
    CatmullRomCurve3,
    CurveType,
    ExtrudeGeometry,
    ExtrudeGeometryOptions,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    Shape,
    Vector2,
    Vector3
} from "three";
import {Tool, V3Array} from "../tool";

export interface IWallOption {
    width: number;
    height: number;
    path: {
        points: V3Array
        closed?: boolean
        curveType?: CurveType
        tension?: number
    },
    extrudeGeometryOptions?: ExtrudeGeometryOptions
}

export class Wall extends Object3D {
    points: Array<Vector3>;
    geometry: ExtrudeGeometry;
    material: MeshStandardMaterial;
    mesh: Mesh

    constructor(options: IWallOption) {
        super();
        const {width, height, path, extrudeGeometryOptions} = options;
        const {closed, curveType, tension, points} = path;
        const pts2 = [];
        pts2.push(new Vector2(0, width));
        pts2.push(new Vector2(-height, width));
        pts2.push(new Vector2(-height, 0));
        pts2.push(new Vector2(0, 0));

        const shape = new Shape(pts2);

        this.points = Tool.v3ArrayToVector3Array(points)


        const curve = new CatmullRomCurve3(this.points, closed, curveType, tension);
        curve.arcLengthDivisions = 1000;

        const extrudeSettings = {
            steps: this.points.length * 100,
            // steps: 1,
            bevelEnabled: false,
            extrudePath: curve,
            ...extrudeGeometryOptions
        };
        this.geometry = new ExtrudeGeometry(shape, extrudeSettings);

        this.material = new MeshStandardMaterial();

        this.mesh = new Mesh(this.geometry, this.material)
    }
}

