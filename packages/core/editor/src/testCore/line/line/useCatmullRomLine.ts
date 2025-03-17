import {Pane} from 'tweakpane';
import {clone} from "lodash-es";
import {CatmullRomLine, CurveType, LineMaterialType, LineType, Viewer} from "@plum-render/three-sdk";


export default function useCatmullRomLine(_viewer: Viewer) {

    const subdivisions = 6;
    const recursion = 1;

    const catPoints = [
        [0, 0, 0] as [number, number, number],
        [-8, 6, -5] as [number, number, number],
        [-2, 3, 7] as [number, number, number],
        [6, 4.5, 3] as [number, number, number],
        [0.5, 8, -1] as [number, number, number],
    ]

    const line = new CatmullRomLine(
        {
            points: catPoints,
            materialType: LineMaterialType.LineDashedMaterial,
            materialParams: {
                // vertexColors:true,
                linewidth: 3,
                color: "red",
                // dashSize: 1,
                // gapSize: 0.5
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


    const f2 = pane.addFolder({
        title: 'LineBasicMaterial',
        expanded: false,   // optional
    });
    f2.addBinding(PARAMS.materialParams, 'color');
    f2.addBinding(PARAMS.materialParams, 'scale');
    f2.addBinding(PARAMS.materialParams, 'dashSize');
    f2.addBinding(PARAMS.materialParams, 'gapSize');

    pane.addBinding(PARAMS, 'curveType', {
        options: CurveType
    });
    pane.addBinding(PARAMS, 'closed');
    pane.addBinding(PARAMS, 'tension');
    pane.addBinding(PARAMS, 'segments');

    pane.on('change', (ev) => {
        // 

        // 
        line.update(PARAMS)
    });


}