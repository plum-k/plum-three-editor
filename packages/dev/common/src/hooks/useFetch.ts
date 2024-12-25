import {Reducer, useCallback, useEffect, useReducer} from "react";
import {ApiRes} from "../api";

interface useFetchDataState<T> {
    loading: boolean;
    error: boolean;
    data: T;
}

interface FETCH_INIT {
    type: "FETCH_INIT";
}

interface FETCH_SUCCESS<T> {
    type: 'FETCH_SUCCESS';
    payload: T;
}

interface FETCH_FAILURE {
    type: 'FETCH_FAILURE';
}

type FetchAction<T> = FETCH_INIT | FETCH_SUCCESS<T> | FETCH_FAILURE;
type fun<T> = (...arr: Array<any>) => Promise<ApiRes<T>>

interface IUseFetchConfig<T> {
    fun: fun<T>;
    initialValue: T;
    startRun?: boolean;
    parameter?: Array<any>;
}

function useFetch<T>(config: IUseFetchConfig<T>): [T, ((arr?: Parameters<(...arr: any[]) => Promise<ApiRes<T>>>) => void), {
    loading: any;
    error: any
}] {
    const startRun = config?.startRun ?? true;
    const dataFetchReducer: Reducer<useFetchDataState<T>, FetchAction<T>> = <T>(state: useFetchDataState<T>, action: FetchAction<T>) => {
        switch (action.type) {
            case 'FETCH_INIT':
                return {
                    ...state,
                    loading: true,
                    error: false
                };
            case 'FETCH_SUCCESS':
                return {
                    ...state,
                    loading: false,
                    error: false,
                    data: action.payload,
                };
            case 'FETCH_FAILURE':
                return {
                    ...state,
                    loading: false,
                    error: true,
                };
            default:
                throw new Error();
        }
    };
    const [state, dispatch] = useReducer<Reducer<useFetchDataState<T>,
        FetchAction<T>>>(dataFetchReducer, {
        loading: false,
        error: false,
        data: config.initialValue
    });
    const fetch = useCallback((arr?: Parameters<typeof config.fun>) => {
        dispatch({type: 'FETCH_INIT'});
        let _fun = config.fun;
        if (config.parameter) {
            _fun = config.fun.bind(null, ...config.parameter);
        }
        if (arr) {
            _fun = config.fun.bind(null, ...arr)
        }
        _fun().then(res => {
            if (res.code === 0) {
                dispatch({type: 'FETCH_SUCCESS', payload: res.data});
            }
        }).catch(() => {
            dispatch({type: 'FETCH_FAILURE'});
        })
    }, [config])

    useEffect(() => {
        if (startRun) {
            fetch(config?.parameter);
        }
    }, [])
    return [state.data, fetch, {loading: state.loading, error: state.error}]
}

export  {
    useFetch
};
