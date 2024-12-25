import {req} from "./request";
import {IConsulNode} from "@plum-common/type/src";

export class ConsulApi{
    static  getById = (id: string) => {
        return req.get<IConsulNode>({
            url: `/consul/${id}`
        })
    }
    static    getPage = (page: number, size: number) => {
        return req.get<Array<IConsulNode>>({
            url: `/consul/${page}/${size}`
        })
    }

    static  create = (data: Partial<IConsulNode>) => {
        return req.post({
            data,
            url: `/consul`
        })
    }

    static  edit = (data: Partial<IConsulNode>) => {
        return req.put({
            url: `/consul`,
            data
        })
    }
    static   getAll = () => {
        return req.get<Array<IConsulNode>>({
            url: `/consul/getAll`
        })
    }
    static    remove = (id: number) => {
        return req.delete<Array<IConsulNode>>({
            url: `/consul/${id}`
        })
    }
}

