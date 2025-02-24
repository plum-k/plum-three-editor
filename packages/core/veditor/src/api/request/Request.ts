import axios from "axios";
import type {ApiRes} from "./interface";
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
export class Request {
    axiosInstance: AxiosInstance;

    constructor(config: AxiosRequestConfig) {
        this.axiosInstance = axios.create(config);
    }

    get<T = unknown>(config: AxiosRequestConfig): Promise<ApiRes<T>> {
        return this.request({...config, method: 'get'});
    }

    post<T = unknown>(config: AxiosRequestConfig): Promise<ApiRes<T>> {
        return this.request({...config, method: 'post'});
    }

    put<T = unknown>(config: AxiosRequestConfig): Promise<ApiRes<T>> {
        return this.request({...config, method: 'put'});
    }

    delete<T = unknown>(config: AxiosRequestConfig): Promise<ApiRes<T>> {
        return this.request({...config, method: 'delete'});
    }

    request<T = unknown>(config: AxiosRequestConfig): Promise<ApiRes<T>> {
        return this.axiosInstance.request(config).then((res: AxiosResponse<ApiRes<T>>) => {
            return res.data;
        })
    }
}
