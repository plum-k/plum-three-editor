import {EDistanceMeasureTextModel, Viewer} from @plum-render/three-sdk";

const useMeasureTest = (viewer: Viewer) => {
    // viewer.measureTool.startDistanceMeasure({
    //     pointStopNum: 3,
    //     textModel: EDistanceMeasureTextModel.Segment
    // });

    viewer.measureTool.startDistanceMeasure({
        pointStopNum: 3,
        textModel: EDistanceMeasureTextModel.Total
    });
}

export default useMeasureTest;