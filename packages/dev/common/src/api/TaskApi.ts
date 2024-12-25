import { ITask } from "@plum-common/type";
import {construct} from "../utils";
import {req} from "./request";
export class TaskApi{
    static  getById = (id: string) => {
        return req.get<ITask>({
            url: `/task/${id}`
        })
    }
    static  getPage = (page: number, size: number) => {
        return req.get<Array<ITask>>({
            url: `/task/${page}/${size}`
        })
    }

    static create = (data: Partial<ITask>) => {
        return req.post({
            data,
            url: `/task`
        })
    }

    static   edit = (data: Partial<ITask>) => {
        return req.put({
            url: `/task`,
            data
        })
    }
    static    getAll = () => {
        return req.get<Array<ITask>>({
            url: `/task`
        })
    }
    static  remove = (id: number) => {
        return req.delete<Array<ITask>>({
            url: `/task/${id}`
        })
    }
}

