import {SearchTool, Viewer} from

@plum
-render / three - sdk
";
import {SearchOperator} from "libs/tool/src/Search.ts";

const useSearchTest = (viewer: Viewer) => {
    const aaa = SearchTool.search(viewer.scene, [
        {
            propertyPath: ['material', 'type'],
            operator: SearchOperator.Equal,
            value: 'MeshStandardMaterial'
        }
    ])
    
}

export default useSearchTest;