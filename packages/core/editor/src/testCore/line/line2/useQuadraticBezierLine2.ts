import {Line2Type, QuadraticBezierLine2, Viewer} from

@plum
-render / three - sdk
";
import * as THREE from "three";
import {GeometryUtils} from "three-stdlib";
import {Pane} from 'tweakpane';
import {clone} from "lodash-es";

export default function useQuadraticBezierLine2(_viewer: Viewer) {

    const subdivisions = 6;
    const recursion = 1;

    const points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 25.0, recursion, 0, 1, 2, 3, 4, 5, 6, 7);

    const colors = new Array(points.length).fill(0).map(() => [Math.random(), Math.random(), Math.random()]) as [
        number,
        number,
        number
    ][]

    const line = new QuadraticBezierLine2(
        {
            start: [0, 0, 0],
            end: [4, 7, 5],
            segments: 20,
            // vertexColors: colors,
            lineType: Line2Type.LineSegments2,
            materialParams: {
                resolution: _viewer.getSizeVector2(),
                // vertexColors: true,
                // linewidth: 1,
                // color: "red",
                // dashSize: 1,
                // gapSize: 0.5
            }
        }
    )
    console.log(line)
    line.name = "adad";


    _viewer.scene.add(line)

    let PARAMS = clone(line.options)
    // console.log(PARAMS)
    const pane = new Pane({
        container: _viewer.container
    });
    pane.element.style.position = "absolute";
    pane.element.style.right = "0";
    pane.element.style.top = "0";

    pane.addBinding(PARAMS, 'lineType', {
        options: Line2Type
    });
    // pane.addBinding(PARAMS, 'segments');
    // pane.addBinding(PARAMS.materialParams, 'color');
    // pane.addBinding(PARAMS.materialParams, 'dashSize');
    // pane.addBinding(PARAMS.materialParams, 'gapSize');
    pane.on('change', (ev) => {
        // console.log(ev)
        console.log(PARAMS)
        console.log("更新")
        // console.log('changed: ' + JSON.stringify(ev.value));
        line.update(PARAMS)
    });


}