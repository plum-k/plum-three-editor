// TypeScript type definitions for heatmap.js

interface HeatmapConfig {
    container: HTMLElement; // *required*
    backgroundColor?: string; // *optional*
    gradient?: Record<number | string, string>; // *optional*
    radius?: number; // *optional*
    opacity?: number; // *optional*, default = 0.6
    maxOpacity?: number; // *optional*
    minOpacity?: number; // *optional*
    onExtremaChange?: (data: { min: number; max: number; gradient?: Record<string, string> }) => void; // *optional*
    blur?: number; // *optional*, default = 0.85
    xField?: string; // *optional*, default = "x"
    yField?: string; // *optional*, default = "y"
    valueField?: string; // *optional*, default = "value"
}

interface DataPoint {
    x: number; // x coordinate
    y: number; // y coordinate
    value: number; // value at the datapoint (x, y)
}

interface DataSet {
    max: number; // maximum value in the dataset
    min: number; // minimum value in the dataset
    data: DataPoint[]; // array of datapoints
}

class Heatmap {
    constructor(options: HeatmapConfig);
    addData(data: DataPoint | DataPoint[]): this; // Returns Heatmap
    setData(data: DataSet): this; // Returns Heatmap
    setDataMax(max: number): this; // Returns Heatmap
    setDataMin(min: number): this; // Returns Heatmap
    configure(config: HeatmapConfig): this; // Returns Heatmap
    getValueAt(point: { x: number; y: number }): number | null; // Returns value at datapoint position
    getData(): DataSet; // Returns a persistable JSON object
    getDataURL(): string; // Returns dataURL string
    repaint(): this; // Returns Heatmap
}

interface HeatmapFactory {
    create(config: HeatmapConfig): Heatmap; // Returns a Heatmap
    register(pluginKey: string, plugin: { renderer: any; store: any }): void; // Registers a plugin
}
export {
    HeatmapConfig,
    DataPoint
}

export default Heatmap;
