import {DrawLine, DrawType, Line, Viewer} from

@plum
-render / three - sdk
";

const useDraw = (viewer: Viewer) => {
    let aa = new DrawLine<typeof Line>({
        viewer: viewer
    })
    aa.drawType = DrawType.Line;
    aa.DrawLineType = Line;
    aa.DrawLineParams = {}
    aa.start();
}

export default useDraw;