import {IUeZip} from "@plum-common/type";
import {construct} from "../utils";
import {req} from "./request";

export class UeZipApi{
 static   getById = (id: string) => {
        return req.get<IUeZip>({
            url: `/ue-zip/${id}`
        })
    }
    static   getPage = (page: number, size: number) => {
        return req.get<Array<IUeZip>>({
            url: `/ue-zip/${page}/${size}`
        })
    }

    static   create = (data: Partial<IUeZip>) => {
        return req.post({
            data,
            url: `/ue-zip`
        })
    }

    static   syncById(id: number) {
        return req.get({
            url: `/ue-zip/sync/${id}`
        })
    }

    static   unZIpById(id: number) {
        return req.get({
            url: `/ue-zip/unZip/${id}`
        })
    }

    static   removeUnZipById(id: number) {
        return req.get({
            url: `/ue-zip/removeUnZipById/${id}`
        })
    }

    static   removeUnZipAllById(id: number) {
        return req.get({
            url: `/ue-zip/removeUnZipAllById/${id}`
        })
    }

    static  getExecuteFileNameListById(id: number) {
        return req.get({
            url: `/ue-zip/getExecuteFileNameListById/${id}`
        })
    }

    static  addUeZip = (data: any) => {
        return req.post({
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data,
            url: `/ue-zip/addUeZip`
        })
    }
    static   edit = (data: Partial<IUeZip>) => {
        return req.put({
            url: `/ue-zip`,
            data
        })
    }
    static  getAll = () => {
        return req.get<Array<IUeZip>>({
            url: `/ue-zip`
        })
    }
    static remove = (id: number) => {
        return req.delete<Array<IUeZip>>({
            url: `/ue-zip/${id}`
        })
    }
    static  syncLocalPackages = () => {
        return req.get({
            url: `/ue-zip/syncLocalPackages`
        })
    }
}

