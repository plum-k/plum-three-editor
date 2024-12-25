export default interface IPage<T = unknown> {
    records: Array<T>,
    total: number,
    size: number
    searchCount: boolean,
    current: number
    orders: Array<any>,
    optimizeCountSql: boolean,
    pages: number,
}

