import {useState} from "react";
import {TablePaginationConfig} from "antd/lib/table/interface";
import IPage from "../../../../three-packages/plum-render-edit-three/src/interfaces/IPage";
import {ApiRes} from "../api";
import {useFetch} from "./useFetch.ts";

interface IUseFetchPageConfig<T> {
    initialValue?: Partial<IPage<T>>;
}

export  function usePageFetch<T>(fun: (...arr: Array<any>) => Promise<ApiRes<IPage<T>>>, config?: IUseFetchPageConfig<any>) {
    // const [page, setPage] = useState([1, 10])
    const initialValue = {
        records: [],
        total: 0,
        size: 0,
        searchCount: false,
        current: 0,
        orders: [],
        optimizeCountSql: false,
        pages: 0,
        ...config?.initialValue,
    }
    const [data, fetch, {loading}] = useFetch<IPage<T>>({
        fun: fun,
        initialValue,
        parameter: [1, 10]
    });

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: data.current === 0 ? undefined : data.current,
        total: data.total,
        showTotal: (total: number) => `共 ${total} 条`,
        onChange: (page: number, pageSize?: number) => {
            fetch([page, pageSize ?? 10])
            // setPage([page,pageSize])
        }
    })
    return {data, loading, fetch, pagination, setPagination}
}
