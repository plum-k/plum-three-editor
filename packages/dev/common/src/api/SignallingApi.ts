import {req} from "./request";

export class SignallingApi{
    static killById = (id: number) => {
        return req.delete({
            url: `/signalling/kill/${id}`
        })
    }
    static tasks = () => {
        return req.get({
            url: `/signalling/tasks`
        })
    }
}

