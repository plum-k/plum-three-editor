import {LineMaterialType, LineType, Viewer} from

@plum
-render / three - sdk
";
import * as THREE from "three";
import {GeometryUtils} from "three-stdlib";
import {Pane} from 'tweakpane';
import {clone} from "lodash-es";
import {QuadraticBezierLine} from

@plum
-render / three - sdk
";

export default function useQuadraticBezierLine(_viewer: Viewer) {

    const subdivisions = 6;
    const recursion = 1;

    const points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7);

    const colors = new Array(points.length).fill(0).map(() => [Math.random(), Math.random(), Math.random()]) as [
        number,
        number,
        number
    ][]

    const line = new QuadraticBezierLine(
        {
            start: [0, 0, 0],
            end: [4, 7, 5],
            materialType: LineMaterialType.LineDashedMaterial,
            segments: 10,
            vertexColors: colors,
            materialParams: {
                vertexColors: true,
                linewidth: 3,
                // color: "red",
                dashSize: 1,
                gapSize: 0.5
            }
        }
    )
    
    line.name = "adad";


    _viewer.scene.add(line)

    let PARAMS = clone(line.options)
    // 
    const pane = new Pane({
        container: _viewer.container
    });
    pane.element.style.position = "absolute";
    pane.element.style.right = "0";
    pane.element.style.top = "0";

    pane.addBinding(PARAMS, 'lineType', {
        options: LineType
    });
    pane.addBinding(PARAMS, 'materialType', {
        options: LineMaterialType
    });
    pane.addBinding(PARAMS, 'segments');

    pane.addBinding(PARAMS.materialParams, 'color');
    pane.addBinding(PARAMS.materialParams, 'scale');
    pane.addBinding(PARAMS.materialParams, 'dashSize');
    pane.addBinding(PARAMS.materialParams, 'gapSize');
    pane.on('change', (ev) => {
        // 
        
        
        // 
        line.update(PARAMS)
    });


}